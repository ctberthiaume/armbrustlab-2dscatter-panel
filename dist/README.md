## Flot scatter plot panel for Grafana

* Supports non-time x-axis.
* Create two or more InfluxDB queries.
* The first query will be x-axis values.
* Any additional series (either from single queries or results of group by) will be y-axis values.

### Install

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
