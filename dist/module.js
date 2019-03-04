"use strict";

System.register(["app/plugins/sdk", "app/core/utils/kbn", "app/core/config", "lodash", "moment", "./css/style.css!"], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, kbn, config, _, moment, panelDefaults, TwoDPanelCtrl;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_appCoreConfig) {
      config = _appCoreConfig.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_cssStyleCss) {}],
    execute: function () {
      panelDefaults = {
        lines: true,
        linewidth: 1,
        fill: 1,
        points: false,
        pointradius: 5,
        xaxis: {
          show: true
        },
        yaxes: [{
          show: true,
          logBase: 1,
          format: 'short'
        }],
        range: {
          from: null,
          to: null
        }
      };

      _export("PanelCtrl", TwoDPanelCtrl =
      /*#__PURE__*/
      function (_MetricsPanelCtrl) {
        _inherits(TwoDPanelCtrl, _MetricsPanelCtrl);

        function TwoDPanelCtrl($scope, $injector, $q, $rootScope) {
          var _this;

          _classCallCheck(this, TwoDPanelCtrl);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(TwoDPanelCtrl).call(this, $scope, $injector));
          _this.$scope = $scope;
          _this.$rootScope = $rootScope;
          _this.panelId = 'twod' + _this.panel.id; //this.thresholdManager = new ThresholdManager(this);
          // Must use defaultsDeep here to avoid sharing axis, range state as class
          // variables

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.plotdata = {
            data: [],
            xlabel: null,
            timestamps: {}
          };
          _this.logScales = {
            'linear': 1,
            'log (base 2)': 2,
            'log (base 10)': 10,
            'log (base 32)': 32,
            'log (base 1024)': 1024
          };
          _this.unitFormats = kbn.getUnitFormats();
          _this.$tooltip = $('<div class="graph-tooltip">'); // Need to throttle plot drawing on the trailing side of the timeout.
          // Otherwise plot gets drawn with stale height received from enclosing div.
          // Plotting at the end of the wait period give the div time to achieve a
          // stable height before flot plotting.

          _this.throttledDraw = _.throttle(_this.draw.bind(_assertThisInitialized(_this)), 100, {
            leading: false,
            trailing: true
          });

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_assertThisInitialized(_this)));

          _this.events.on('render', _this.onRender.bind(_assertThisInitialized(_this)));

          _this.events.on('data-received', _this.onDataReceived.bind(_assertThisInitialized(_this)));

          _this.events.on('data-error', _this.onDataError.bind(_assertThisInitialized(_this))); //this.events.on('panel-initialized', this.onPanelInitialized.bind(this));
          //this.events.on('refresh', this.onRefresh.bind(this));


          _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_assertThisInitialized(_this)));

          return _this;
        }

        _createClass(TwoDPanelCtrl, [{
          key: "onDataError",
          value: function onDataError(err) {
            //console.log("onDataError", err);
            $('#' + this.panelId).empty();
            this.plotdata.data = [];
            this.plotdata.timestamps = {};
            this.plotdata.xlabel = null;
          }
        }, {
          key: "onPanelInitialized",
          value: function onPanelInitialized() {//console.log('initialized');
          }
        }, {
          key: "onPanelTeardown",
          value: function onPanelTeardown() {
            //console.log('teardown');
            $('#' + this.panelId).empty(); //this.$timeout.cancel(this.nextTickPromise);
          }
        }, {
          key: "onRefresh",
          value: function onRefresh() {//console.log('refresh');
          }
        }, {
          key: "onInitEditMode",
          value: function onInitEditMode() {
            this.addEditorTab('Axes', 'public/plugins/armbrustlab-2dscatter-panel/axes_editor.html', 2);
            this.addEditorTab('Display', 'public/plugins/armbrustlab-2dscatter-panel/tab_display.html', 3);
            this.subTabIndex = 0;
          }
        }, {
          key: "onRender",
          value: function onRender() {
            this.throttledDraw();
          }
        }, {
          key: "draw",
          value: function draw() {
            $('#' + this.panelId).empty();

            if (this.plotdata.data.length === 0) {
              return;
            }

            var options = {
              hooks: {
                draw: [this.drawHook.bind(this)],
                processOffset: [this.processOffsetHook.bind(this)]
              },
              legend: {
                show: true // disable/enable legend

              },
              series: {
                lines: {
                  show: this.panel.lines,
                  zero: false,
                  lineWidth: this.panel.linewidth,
                  fill: this.translateFillOption(this.panel.fill)
                },
                points: {
                  show: this.panel.points,
                  fill: 1,
                  fillColor: false,
                  radius: this.panel.points ? this.panel.pointradius : 2
                },
                shadowSize: 0
              },
              yaxes: [],
              xaxis: {},
              grid: {
                minBorderMargin: 0,
                markings: [],
                backgroundColor: null,
                borderWidth: 0,
                hoverable: true,
                clickable: true,
                color: '#c8c8c8',
                margin: {
                  left: 0,
                  right: 0
                }
              },
              crosshair: {
                mode: 'x'
              }
            };
            this.addXAxis(options);
            this.addYAxes(options); // Make plot

            $('#' + this.panelId).plot(this.plotdata.data, options); // Hover event handler

            $('#' + this.panelId).bind('plothover', _.throttle(this.createPlotHoverHandler(), 50)); // Manually apply theme css

            this.styleTheme();
            this.renderingCompleted();
          }
        }, {
          key: "onDataReceived",
          value: function onDataReceived(dataList) {
            var _this2 = this;

            //console.log('received', dataList);
            this.plotdata.data = [];
            this.plotdata.timestamps = {};
            this.plotdata.xlabel = null;

            if (!dataList || dataList.length < 2) {//console.log( "No data", dataList );
            } else {
              // First series in dataList is always x-axis data
              this.plotdata.xlabel = dataList[0].target; // Make all y data series and timestamp lists

              dataList.slice(1).forEach(function (d) {
                var xy = [];
                var ts = [];
                var maxy = -Number.MAX_VALUE;
                var logminy = Number.MAX_VALUE;
                var xoffset = 0; // If this Y doesn't align with the beginning of the X range,
                // search forward to find the offset into X where it does...

                if (dataList[0].datapoints[0][1] !== d.datapoints[0][1]) {
                  for (xoffset = 0; xoffset < dataList[0].datapoints.length; xoffset++) {
                    if (dataList[0].datapoints[xoffset][1] === d.datapoints[0][1]) break;
                  }
                }

                if (xoffset < dataList[0].datapoints.length) {
                  d.datapoints.forEach(function (val, j) {
                    if (_.isFinite(dataList[0].datapoints[j + xoffset][0])) {
                      // Only keep values with defined x, but keep null y to create
                      // discontinuous segments
                      xy.push([dataList[0].datapoints[j + xoffset][0], val[0]]);
                      ts.push(val[1]); // time for hover tooltip

                      if (val[0] > maxy) maxy = val[0];
                      if (val[0] < logminy && val[0] > 0) logminy = val[0];
                    }
                  });
                }

                if (maxy === -Number.MAX_VALUE) maxy = null;
                if (logminy === Number.MAX_VALUE) logminy = null;

                _this2.plotdata.data.push({
                  label: d.target,
                  data: xy,
                  yaxis: 1,
                  stats: {
                    max: maxy,
                    logmin: logminy
                  }
                });

                _this2.plotdata.timestamps[d.target] = ts;
              }); //console.log('DATA: ', this.plotdata);
            }

            this.render();
          }
        }, {
          key: "createPlotHoverHandler",
          value: function createPlotHoverHandler(event, pos, item) {
            var _this3 = this;

            return function (event, pos, item) {
              if (item) {
                var ts = _this3.plotdata.timestamps[item.series.label][item.dataIndex];
                var y = {
                  label: item.series.label,
                  value: item.datapoint[1]
                };
                var x = {
                  label: _this3.plotdata.xlabel,
                  value: item.datapoint[0]
                };
                var body = '<div class="graph-tooltip-time">' + _this3.dashboard.formatDate(moment(ts)) + '</div>';
                body += "<center>";
                body += '<div class="graph-tooltip-list-item">';
                body += '<div class="graph-tooltip-series-name"><i class="fa fa-minus" style="color:' + item.series.color + ';"></i> ' + x.label + ' (x): </div>';
                body += '<div class="graph-tooltip-value">' + x.value.toPrecision(4) + '</div>';
                body += '</div>';
                body += '<div class="graph-tooltip-list-item">';
                body += '<div class="graph-tooltip-series-name"><i class="fa fa-minus" style="color:' + item.series.color + ';"></i> ' + y.label + ' (y): </div>';
                body += '<div class="graph-tooltip-value">' + y.value.toPrecision(4) + '</div>';
                body += '</div>';
                body += "</center>";

                _this3.$tooltip.html(body).place_tt(pos.pageX + 20, pos.pageY);
              } else {
                _this3.$tooltip.detach();
              }
            };
          }
        }, {
          key: "translateFillOption",
          value: function translateFillOption(fill) {
            return fill === 0 ? 0.001 : fill / 10;
          }
        }, {
          key: "addXAxis",
          value: function addXAxis(options) {
            options.xaxis = {
              show: this.panel.xaxis.show,
              min: this.panel.xaxis.min ? _.toNumber(this.panel.xaxis.min) : null,
              max: this.panel.xaxis.max ? _.toNumber(this.panel.xaxis.max) : null,
              label: this.panel.xaxis.label
            };
          }
        }, {
          key: "addYAxes",
          value: function addYAxes(options) {
            var defaults = {
              position: 'left',
              show: this.panel.yaxes[0].show,
              index: 1,
              logBase: this.panel.yaxes[0].logBase || 1,
              min: this.panel.yaxes[0].min ? _.toNumber(this.panel.yaxes[0].min) : null,
              max: this.panel.yaxes[0].max ? _.toNumber(this.panel.yaxes[0].max) : null
            };
            options.yaxes.push(defaults);

            if (_.find(this.plotdata.data, {
              yaxis: 2
            })) {
              var secondY = _.clone(defaults);

              secondY.index = 2;
              secondY.show = this.panel.yaxes[1].show;
              secondY.logBase = this.panel.yaxes[1].logBase || 1;
              secondY.position = 'right';
              secondY.min = this.panel.yaxes[1].min ? _.toNumber(this.panel.yaxes[1].min) : null;
              secondY.max = this.panel.yaxes[1].max ? _.toNumber(this.panel.yaxes[1].max) : null;
              options.yaxes.push(secondY);
              this.applyLogScale(options.yaxes[1], this.plotdata.data); //configureAxisMode(options.yaxes[1], panel.percentage && panel.stack ? "percent" : panel.yaxes[1].format);
            }

            this.applyLogScale(options.yaxes[0], this.plotdata.data);
            this.configureAxisMode(options.yaxes[0], this.panel.yaxes[0].format);
          }
        }, {
          key: "applyLogScale",
          value: function applyLogScale(axis, data) {
            if (axis.logBase === 1) {
              return;
            }

            if (axis.min < Number.MIN_VALUE) {
              axis.min = null;
            }

            if (axis.max < Number.MIN_VALUE) {
              axis.max = null;
            }

            var series, i;
            var max = axis.max,
                min = axis.min;

            for (i = 0; i < data.length; i++) {
              series = data[i];

              if (series.yaxis === axis.index) {
                if (!max || max < series.stats.max) {
                  max = series.stats.max;
                }

                if (!min || min > series.stats.logmin) {
                  min = series.stats.logmin;
                }
              }
            }

            axis.transform = function (v) {
              return v < Number.MIN_VALUE ? null : Math.log(v) / Math.log(axis.logBase);
            };

            axis.inverseTransform = function (v) {
              return Math.pow(axis.logBase, v);
            };

            if (!max && !min) {
              max = axis.inverseTransform(+2);
              min = axis.inverseTransform(-2);
            } else if (!max) {
              max = min * axis.inverseTransform(+4);
            } else if (!min) {
              min = max * axis.inverseTransform(-4);
            }

            if (axis.min) {
              min = axis.inverseTransform(Math.ceil(axis.transform(axis.min)));
            } else {
              min = axis.min = axis.inverseTransform(Math.floor(axis.transform(min)));
            }

            if (axis.max) {
              max = axis.inverseTransform(Math.floor(axis.transform(axis.max)));
            } else {
              max = axis.max = axis.inverseTransform(Math.ceil(axis.transform(max)));
            }

            if (!min || min < Number.MIN_VALUE || !max || max < Number.MIN_VALUE) {
              return;
            }

            axis.ticks = [];
            var nextTick;

            for (nextTick = min; nextTick <= max; nextTick *= axis.logBase) {
              axis.ticks.push(nextTick);
            }

            axis.tickDecimals = this.decimalPlaces(min);
          }
        }, {
          key: "decimalPlaces",
          value: function decimalPlaces(num) {
            if (!num) {
              return 0;
            }

            return (num.toString().split('.')[1] || []).length;
          }
        }, {
          key: "configureAxisMode",
          value: function configureAxisMode(axis, format) {
            axis.tickFormatter = function (val, axis) {
              return kbn.valueFormats[format](val, axis.tickDecimals, axis.scaledDecimals);
            };
          }
        }, {
          key: "setUnitFormat",
          value: function setUnitFormat(axis, subItem) {
            axis.format = subItem.value;
            this.render();
          }
        }, {
          key: "drawHook",
          value: function drawHook(plot) {
            // Update legend values
            var yaxis = plot.getYAxes();

            for (var i = 0; i < this.plotdata.data.length; i++) {
              var series = this.plotdata.data[i];
              var axis = yaxis[series.yaxis - 1];
              var formater = kbn.valueFormats[this.panel.yaxes[series.yaxis - 1].format]; // decimal override

              if (_.isNumber(this.panel.decimals)) {//series.updateLegendValues(formater, this.panel.decimals, null);
              } else {
                // auto decimals
                // legend and tooltip gets one more decimal precision
                // than graph legend ticks
                var tickDecimals = (axis.tickDecimals || -1) + 1; //series.updateLegendValues(formater, tickDecimals, axis.scaledDecimals + 2);
              }

              if (!this.$rootScope.$$phase) {
                this.$scope.$digest();
              }
            } // add left axis labels


            if (this.panel.yaxes[0].label) {
              var yaxisLabel = $("<div class='axisLabel left-yaxis-label flot-temp-elem'></div>").text(this.panel.yaxes[0].label).appendTo($('#' + this.panelId));
            } // add right axis labels

            /*if (this.panel.yaxes[1].label) {
              var rightLabel = $("<div class='axisLabel right-yaxis-label flot-temp-elem'></div>")
              .text(this.panel.yaxes[1].label)
              .appendTo($('#' + this.panelId));
            }*/
            //this.thresholdManager.draw(plot);

          }
        }, {
          key: "processOffsetHook",
          value: function processOffsetHook(plot, gridMargin) {
            var left = this.panel.yaxes[0]; //var right = this.panel.yaxes[1];

            if (left.show && left.label) {
              gridMargin.left = 20;
            } //if (right.show && right.label) { gridMargin.right = 20; }
            // apply y-axis min/max options


            var yaxis = plot.getYAxes(); //for (var i = 0; i < yaxis.length; i++) {

            var axis = yaxis[0];
            var panelOptions = this.panel.yaxes[0];
            axis.options.max = panelOptions.max;
            axis.options.min = panelOptions.min; //}
          }
        }, {
          key: "styleTheme",
          value: function styleTheme() {
            if (config.bootData.user.lightTheme) {
              $('.legend > div').css('background-color', 'rgb(255,255,255)');
            } else {
              $('.legend > div').css('background-color', 'rgb(25,25,25)');
            }
          }
        }]);

        return TwoDPanelCtrl;
      }(MetricsPanelCtrl));

      TwoDPanelCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=module.js.map
