import asyncio
from concurrent.futures import ThreadPoolExecutor
import websockets
from websockets import WebSocketServerProtocol
import json
import requests
from requests import RequestException, ConnectionError, HTTPError, URLRequired, TooManyRedirects, ConnectTimeout, ReadTimeout, Timeout
from datetime import datetime
import functools

from os import getenv

from urllib3.exceptions import ConnectTimeoutError

import logging

if getenv("DEBUG_LOGGING"):
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.INFO)
requests_logger = logging.getLogger('requests')
requests_logger.setLevel(logging.WARNING)
requests_logger = logging.getLogger('urllib3')
requests_logger.setLevel(logging.WARNING)
requests_logger = logging.getLogger('websockets')
requests_logger.setLevel(logging.WARNING)


class State:
    def __init__(self):
        with open("data.json") as fh:
            self._state = json.loads("".join(fh.readlines()))
        now = datetime.now()
        self._timedout = False
        self.timeoutCount = 0
        self.lastDateTime = 0
        self._state["version"] = "{}{}{}{}{}{}".format(now.year, now.month, now.day, now.hour, now.minute, now.second)
        self.clear_changes()

    def _change(self, section, key, value, force = False):
        logging.debug("Implementing change of {}.{} to {}".format(section, key, value))
        try:
            if (self._state[section][key] != value) or force:
                self._changes[section][key] = value
                self._state[section][key] = value
                self._hasChanges = True
        except KeyError:
            self._changes[section][key] = value
            self._state[section][key] = value
            self._hasChanges = True

    def change_point(self, point, value):
        logging.debug("Changing Point {}".format(point))
        self._change("points", point, value)

    def change_signal(self, signal, value):
        self._change("signals", signal, value)

    def change_section(self, section, value):
        self._change("sections", section, value)

    def change_request(self, request, value):
        self._change("requests", request, value)

    def change_callin(self, callin, value):
        self._change("callin", callin, value)

    def change_message(self, message, text):
        self._change("messages", message, text)
    def set_messages(self, messages):
        logging.debug("Setting messages to {}".format(messages))
        self._changes["messages"] = messages
        self._state["messages"] = messages
        self._hasChanges = True
    def change_info(self, info, value):
        self._change("info", info, value)
    
    def change_crossing(self, crossing, value):
        self._change("crossings", crossing, value)

    def getChanges(self):
        chgs = self.peekChanges()
        chgs['version'] = self._state['version']
        chgs['info'] = self._state['info']
        chgs['info']['timedout'] = int(self._timedout)
        self.clear_changes()
        return chgs

    def peekChanges(self):
        return self._changes

    def hasChanges(self):
        return self._hasChanges

    def clear_changes(self):
        self._changes = {"points": {}, "sections": {}, "signals": {}, "requests": {}, "callin": {}, "messages": {}, "info": {}, "crossings": {}}
        self._hasChanges = False

    def getState(self):
        return self._state


class Server:
    _clients = set()

    async def register(self, ws: WebSocketServerProtocol) -> None:
        self._clients.add(ws)
        await ws.send(json.dumps(state.getState()))
        logging.info("{} connected".format(ws.remote_address))

    async def unregister(self, ws: WebSocketServerProtocol) -> None:
        self._clients.remove(ws)
        logging.info("{} disconnected".format(ws.remote_address))

    async def send_to_clients(self, message: str) -> None:
        if self._clients:
            for client in self._clients:
                try:
                    await asyncio.create_task(client.send(message))
                except websockets.exceptions.ConnectionClosedError:
                    logging.debug("Client timeout, unregistering {}".format(client))
                    self.unregister(client)
                    await asyncio.create_task(client.close())
                except websockets.exceptions.ConnectionClosedOK:
                    pass

    async def ws_handler(self, ws: WebSocketServerProtocol, uri: str) -> None:
        await self.register(ws)
        try:
            await self.distribute(ws)
        finally:
            await self.unregister(ws)
    
    async def distribute(self, ws: WebSocketServerProtocol) -> None:
        await asyncio.Future()


async def demoTrain():
    occupied = True
    while True:
        logging.debug("Occupying H")
        state.change_section("H", {"state": "occupied"})
        await asyncio.sleep(5)
        logging.debug("TRTS")
        state.change_request("AJ1E", {"type": "trts", "state": True})
        await asyncio.sleep(5)
        logging.debug("Routing P11")
        state.change_point("P11", { "route": "normal", "state": "route" })
        logging.debug("Routing P5a")
        state.change_point("P5a", { "route": "reverse", "state": "route" })
        logging.debug("Routing K")
        state.change_section("K", {"state": "route"})
        logging.debug("Routing P5b")
        state.change_point("P5b", { "route": "reverse", "state": "route" })
        logging.debug("Routing M")
        state.change_section("M", {"state": "route"})
        await asyncio.sleep(1)
        logging.debug("Clearing AJ1E")
        state.change_signal("AJ1E", {"signal": "caution"})
        logging.debug("clearing TRTS")
        state.change_request("AJ1E", {"type": "trts", "state": False})
        await asyncio.sleep(1)
        state.change_signal("AJ1E", {"signal": "clear"})
        state.change_signal("AJ18E", {"signal": "caution"})
        state.change_section("N", {"state": "route"})
        await asyncio.sleep(2)
        state.change_point("P11",  { "route": "normal", "state": "occupied" })
        state.change_point("P5a",  { "route": "reverse", "state": "occupied" })
        state.change_signal("AJ1E", {"signal": "danger"})
        await asyncio.sleep(1)
        state.change_section("K", {"state": "occupied"})
        await asyncio.sleep(2)
        state.change_point("P5b", { "route": "reverse", "state": "occupied" })
        await asyncio.sleep(1)
        state.change_section("M", {"state": "occupied"})
        state.change_section("H", {"state": "unoccupied"})
        await asyncio.sleep(2)
        state.change_point("P11", { "route": "normal", "state": "unoccupied" })
        await asyncio.sleep(1)
        state.change_point("P5a", { "route": "reverse", "state": "unoccupied" })
        state.change_point("P14", { "route": "normal", "state": "route" })
        state.change_section("NO", {"state": "route"})
        state.change_section("O", {"state": "route"})
        state.change_signal("AJ9E", {"signal": "caution"})
        state.change_signal("AJ18E", {"signal": "clear"})
        await asyncio.sleep(1)
        state.change_section("K", {"state": "unoccupied"})
        await asyncio.sleep(1)
        state.change_point("P5b", { "route": "reverse", "state": "unoccupied" })
        await asyncio.sleep(1)
        state.change_point("P5a", { "route": "normal", "state": "unoccupied" })
        state.change_point("P5b", { "route": "normal", "state": "unoccupied" })
        await asyncio.sleep(4)
        state.change_section("N", {"state": "occupied"})
        state.change_signal("AJ18E", {"signal": "danger"})
        await asyncio.sleep(2)
        state.change_section("OP", {"state": "route"})
        state.change_section("P", {"state": "route"})
        state.change_signal("AJ17E", {"signal": "caution"})
        state.change_signal("AJ9E", {"signal": "clear"})
        state.change_section("M", {"state": "unoccupied"})
        await asyncio.sleep(6)
        state.change_point("P14", { "route": "normal", "state": "occupied" })
        state.change_signal("AJ9E", {"signal": "danger"})
        state.change_section("NO", {"state": "occupied"})
        await asyncio.sleep(1)
        state.change_section("O", {"state": "occupied"})
        state.change_section("N", {"state": "unoccupied"})
        await asyncio.sleep(1)
        state.change_point("P14", { "route": "normal", "state": "unoccupied" })
        await asyncio.sleep(1)
        state.change_section("NO", {"state": "unoccupied"})
        state.change_section("Q", {"state": "route"})
        state.change_section("R", {"state": "route"})
        state.change_signal("AJ2E", {"signal": "caution"})
        state.change_signal("AJ17E", {"signal": "clear"})
        state.change_point("P6a", { "route": "reverse", "state": "route" })
        state.change_section("J", {"state": "route"})
        state.change_point("P10", { "route": "normal", "state": "route" })
        state.change_point("P6b", { "route": "reverse", "state": "route" })
        state.change_section("B", {"state": "route"})
        await asyncio.sleep(10)
        state.change_section("OP", {"state": "occupied"})
        state.change_signal("AJ17E", {"signal": "danger"})
        await asyncio.sleep(2)
        state.change_section("P", {"state": "occupied"})
        await asyncio.sleep(2)
        state.change_section("O", {"state": "unoccupied"})
        await asyncio.sleep(2)
        state.change_section("OP", {"state": "unoccupied"})
        await asyncio.sleep(2)
        state.change_section("C", {"state": "route"})
        state.change_point("P19", { "route": "normal", "state": "route" })
        state.change_signal("AJ16E", {"signal": "caution"})
        state.change_signal("AJ2E", {"signal": "clear"})
        await asyncio.sleep(8)
        state.change_section("Q", {"state": "occupied"})
        state.change_section("R", {"state": "occupied"})
        state.change_point("P10", { "route": "normal", "state": "occupied" })
        state.change_signal("AJ2E", {"signal": "danger"})
        await asyncio.sleep(2)
        state.change_point("P6a", { "route": "reverse", "state": "occupied" })
        await asyncio.sleep(1)
        state.change_section("J", {"state": "occupied"})
        await asyncio.sleep(1)
        state.change_point("P6b", { "route": "reverse", "state": "occupied" })
        await asyncio.sleep(2)
        state.change_section("B", {"state": "occupied"})
        state.change_section("P", {"state": "unoccupied"})
        await asyncio.sleep(1)
        state.change_point("P10", { "route": "normal", "state": "unoccupied" })
        state.change_section("Q", {"state": "unoccupied"})
        state.change_section("R", {"state": "unoccupied"})
        await asyncio.sleep(2)
        state.change_point("P6a", { "route": "reverse", "state": "unoccupied" })
        await asyncio.sleep(1)
        state.change_section("J", {"state": "unoccupied"})
        await asyncio.sleep(1)
        state.change_point("P6b", { "route": "normal", "state": "unoccupied" })
        state.change_point("P6a", { "route": "normal", "state": "unoccupied" })
        state.change_section("D", {"state": "route"})
        state.change_section("CD", {"state": "route"})
        state.change_signal("AJ8E", {"signal": "caution"})
        state.change_signal("AJ16E", {"signal": "clear"})
        await asyncio.sleep(6)
        state.change_section("C", {"state": "occupied"})
        state.change_point("P19", { "route": "normal", "state": "occupied" })
        state.change_signal("AJ16E", {"signal": "danger"})
        state.change_section("DE", {"state": "route"})
        state.change_section("E", {"state": "route"})
        state.change_signal("AJ3E", {"signal": "caution"})
        state.change_signal("AJ8E", {"signal": "clear"})
        await asyncio.sleep(2)
        state.change_section("B", {"state": "unoccupied"})
        await asyncio.sleep(8)
        state.change_section("D", {"state": "occupied"})
        state.change_section("CD", {"state": "occupied"})
        state.change_signal("AJ8E", {"signal": "danger"})
        state.change_section("F", {"state": "route"})
        state.change_point("P13", { "route": "normal", "state": "route" })
        state.change_point("P12", { "route": "normal", "state": "route" })
        state.change_section("G", {"state": "route"})
        state.change_section("H", {"state": "route"})
        state.change_signal("AJ4E", {"signal": "clear"})
        state.change_signal("AJ3E", {"signal": "clear"})
        state.change_signal("AJ7E", {"signal": "clear"})
        await asyncio.sleep(4)
        state.change_section("C", {"state": "unoccupied"})
        state.change_point("P19", { "route": "normal", "state": "unoccupied" })
        await asyncio.sleep(10)
        state.change_section("DE", {"state": "occupied"})
        await asyncio.sleep(1)
        state.change_section("E", {"state": "occupied"})
        await asyncio.sleep(1)
        state.change_signal("AJ3E", {"signal": "danger"})
        await asyncio.sleep(4)
        state.change_section("D", {"state": "unoccupied"})
        state.change_section("CD", {"state": "unoccupied"})
        await asyncio.sleep(2)
        state.change_section("DE", {"state": "unoccupied"})
        await asyncio.sleep(8)
        state.change_point("P13", { "route": "normal", "state": "occupied" })
        state.change_signal("AJ4E", {"signal": "danger"})
        await asyncio.sleep(1)
        state.change_section("F", {"state": "occupied"})
        await asyncio.sleep(6)
        state.change_section("E", {"state": "unoccupied"})
        state.change_point("P12", { "route": "normal", "state": "occupied" })
        await asyncio.sleep(1)
        state.change_point("P13", { "route": "normal", "state": "unoccupied" })
        state.change_section("G", {"state": "occupied"})
        await asyncio.sleep(3)
        state.change_section("F", {"state": "unoccupied"})
        await asyncio.sleep(2)
        state.change_point("P12", { "route": "normal", "state": "unoccupied" })
        await asyncio.sleep(2)
        state.change_section("H", {"state": "occupied"})
        state.change_signal("AJ7E", {"signal": "danger"})
        await asyncio.sleep(3)
        state.change_section("G", {"state": "unoccupied"})


async def realTrains():
    while True:
        await asyncio.sleep(0.25)
        try:
            # logging.debug("Get starting")
            req = await loop.run_in_executor(executor, functools.partial(requests.get, getenv('UPSTREAM_URL'), timeout=5))
            # logging.debug("Get got")
            if req.status_code == 200:
                response = req.json()
                curstate = state.getState()
                for section in response["sections"]:
                    try:
                        if curstate["sections"][section] != response["sections"][section]:
                            state.change_section(section, response["sections"][section])
                    except KeyError:
                        state.change_section(section, response["sections"][section])

                for point in response["points"]:
                    try:
                        if curstate["points"][point] != response["points"][point]:
                            state.change_point(point, response["points"][point])
                    except KeyError:
                        state.change_point(point, response["points"][point])

                for signal in response["signals"]:
                    try:
                        if curstate["signals"][signal] != response["signals"][signal]:
                            state.change_signal(signal, response["signals"][signal])
                    except KeyError:
                        state.change_signal(signal, response["signals"][signal])

                for callin in response["callinnew"]:
                    try:
                        if curstate["callin"][callin] != response["callinnew"][callin]:
                            state.change_callin(callin, response["callinnew"][callin])
                    except KeyError:
                        state.change_callin(callin, response["callinnew"][callin])

                for request in response["requestsnew"]:
                    try:
                        if curstate["requests"][request] != response["requestsnew"][request]:
                            state.change_request(request,  response["requestsnew"][request])
                    except KeyError:
                        state.change_request(request, response["requestsnew"][request])

                for crossing in response["crossings"]:
                    try:
                        if curstate["crossings"][crossing] != response["crossings"][crossing]:
                            state.change_crossing(crossing, response["crossings"][crossing])
                    except KeyError:
                        state.change_crossing(crossing, response["crossings"][crossing])
                    
                for info in response["info"]:
                    if info == "datetime":
                        continue
                    try:
                        if response["info"][info] != curstate["info"][info]:
                            state.change_info(info, response["info"][info])
                    except KeyError:
                        state.change_info(info, response["info"][info])
                if int(response["info"]["datetime"]) > state.lastDateTime:
                    state.lastDateTime = int(response["info"]["datetime"])
                    state.timeoutCount = 0
                else:
                    #logging.debug("Timeout Counter: {}".format(state.timeoutCount))
                    state.timeoutCount += 1
                state._timedout = (state.timeoutCount > 120)
                state.set_messages(response["messagesnew"])
            else:
                logging.warning("Failed to get")

        except ConnectTimeout as e:
            state._timedout = True
            state._hasChanges = True
            logging.warning("Unable to connect to backend server")
            logging.debug("Got ConnectTimeout exception in realTrains: {}".format(e))
        except ConnectTimeoutError as e:
            logging.debug("Got Connect Timeout exception in realTrains: {}".format(e))
        except ConnectionError as e:
            logging.debug("Got Connection exception in realTrains: {}".format(e))
        except HTTPError as e:
            logging.debug("Got HTTPError exception in realTrains: {}".format(e))
        except URLRequired as e:
            logging.debug("Got URLRequired exception in realTrains: {}".format(e))
        except TooManyRedirects as e:
            logging.debug("Got TooManyRedirects exception in realTrains: {}".format(e))
        except ReadTimeout as e:
            logging.debug("Got ReadTimeout exception in realTrains: {}".format(e))
        except Timeout as e:
            logging.debug("Got Timeout exception in realTrains: {}".format(e))
        except RequestException as e:
            logging.debug("Got Request exception in realTrains: {}".format(e))
        except Exception as e:
            logging.debug("Got Generic exception in realTrains: {}".format(e))
        except:
            logging.debug("Got unusal exception in realTrains")

async def sendChanges():
    while True:
        try:
            await asyncio.sleep(0.25)
            if state.hasChanges():
                changes = json.dumps(state.getChanges())
                await server.send_to_clients(changes)
        except Exception as e:
            logging.debug("Got exception in sendChanges: {}".format(e))
        except:
            logging.debug("Got unusal exception in sendChanges")

server = Server()
state = State()
executor = ThreadPoolExecutor(2)

start_server = websockets.serve(server.ws_handler, '0.0.0.0', 4000)

loop = asyncio.get_event_loop()
loop.run_until_complete(start_server)
if getenv("DEMO_MODE") == 1:
    asyncio.gather(demoTrain(), sendChanges())
else:
    asyncio.gather(realTrains(), sendChanges())
loop.run_forever()