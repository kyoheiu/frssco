FROM denoland/deno:debian-1.32.5

WORKDIR /app

COPY . .
RUN deno cache main.ts --import-map=import_map.json

EXPOSE 8080

CMD ["run", "-A", "--unstable", "main.ts"]