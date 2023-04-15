FROM denoland/deno:latest

WORKDIR /app

COPY . .
RUN deno cache main.ts --import-map=import_map.json

EXPOSE 8080

CMD ["run", "-A", "--unstable", "main.ts"]