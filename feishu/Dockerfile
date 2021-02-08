FROM chatopera/python37:latest

LABEL maintainer="hain@chatopera.com"

COPY ./app /app
WORKDIR /app
RUN pip install -r requirements.txt && touch /app/.env

EXPOSE 8991
CMD ["/bin/bash", "-c", "./serve.sh"]