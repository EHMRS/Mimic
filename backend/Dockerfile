FROM python:3.9-alpine

LABEL org.opencontainers.image.source https://github.com/EHMRS/ModernMimic-Server

WORKDIR /app
ENTRYPOINT python /app/app.py
EXPOSE 4000

COPY app.py /app/
COPY requirements.txt /app/
COPY data.json /app/

RUN pip install -r /app/requirements.txt