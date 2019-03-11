ARG GRAFANA_VERSION="latest"

FROM grafana/grafana:${GRAFANA_VERSION}

USER grafana

RUN mkdir "$GF_PATHS_PLUGINS"/armbrustlab-2dscatter-panel

COPY ./dist/ "$GF_PATHS_PLUGINS"/armbrustlab-2dscatter-panel
