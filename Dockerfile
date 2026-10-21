FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY index.html style.css app.js materi.mp4 ./

ENV APP_NAME=elementary-science-gamification \
    APP_ENV=production \
    CONTAINER_PORT=80

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:${CONTAINER_PORT}/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
