## Flot scatter plot panel for Grafana

* Supports non-time x-axis.
* Create two or more InfluxDB queries.
* The first query will be x-axis values.
* Any additional series (either from single queries or results of group by) will be y-axis values.

### Install

This plugin has been tested against Grafana 6.

```
cp -r dist /var/lib/grafana/plugins/armbrustlab-twodscatter-panel
```
Then restart Grafana to pick up the new plugin.

Or if you want to start from a fresh grunt pipeline build.

```
yarn install --pure-lockfile
grunt
cp -r dist /var/lib/grafana/plugins/armbrustlab-twodscatter-panel
```
And restart Grafana.

#### Docker image

To build a docker image with this plugin at `/var/lib/grafana/plugins/armbrustlab-2dscatter-panel` and Grafana 6.0.0.

```
docker build --build-args GRAFANA_VERSION=6.0.0 -t grafana .
```

To run, follow instructions in Grafana docs at [http://docs.grafana.org/installation/docker/](http://docs.grafana.org/installation/docker/).