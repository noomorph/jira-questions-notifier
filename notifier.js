(function () {
    var notifier = {
        spyHistory: function () {
            var old = location.pathname;

            setInterval(function () {
                if (location.pathname !== old) {
                    old = location.pathname;
                    notifier.probe.make();
                }
            }, 500);
        },
        ribbon: {
            create: function () {
                var ribbon = document.createElement("DIV");

                ribbon.id = 'sheela';
                ribbon.style.backgroundImage = 'url(' + chrome.extension.getURL('ribbon.png') + ')';
                ribbon.style.backgroundRepeat = 'none';
                ribbon.style.position = 'fixed';
                ribbon.style.top = 0;
                ribbon.style.right = 0;
                ribbon.style.zIndex = 999;
                ribbon.style.width = '149px';
                ribbon.style.height = '149px';
                ribbon.style.pointerEvents = 'none';
                ribbon.style.display = 'none';

                document.body.appendChild(ribbon);
                return ribbon;
            },
            get: function () {
                var ribbon = document.getElementById('sheela');
                return ribbon || notifier.ribbon.create();
            },
            show: function () {
                notifier.ribbon.get().style.display = 'block';
            },
            hide: function () {
                notifier.ribbon.get().style.display = 'none';
            }
        },
        probe: {
            ISSUE_REGEX: /^http.*\/browse\/\w+-\d+/,
            BODY_REGEX: />\s*no answer\s*</i,
            isNeeded: function () {
                return notifier.probe.ISSUE_REGEX.test(location.href);
            },
            buildUrl: function () {
                var regex = notifier.probe.ISSUE_REGEX;
                return location.href.match(regex)[0] + "?page=ro.agrade.jira.qanda:qanda-tabpanel";
            },
            make: function () {
                notifier.ribbon.hide();

                var url = notifier.probe.buildUrl(),
                    regex = notifier.probe.BODY_REGEX,
                    request = new XMLHttpRequest(); 

                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        if (this.responseText.match(regex)) {
                            notifier.ribbon.show();
                        }
                    }
                }.bind(request);

                request.open("GET", url, true);
                request.send();
            }
        }
    };

    notifier.spyHistory();
    notifier.ribbon.create();
    notifier.probe.make();
}());
