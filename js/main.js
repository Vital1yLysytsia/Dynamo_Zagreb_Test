/*function formatDate(date) {
    const dateObj = new Date(date);
    return dateObj.getDate() + '.' + (dateObj.getMonth() < 9 ? '0' : '') + (dateObj.getMonth() + 1)
}

(async function () {

    const ukLeng = document.querySelector('#ukLeng'),
        enLeng = document.querySelector('#enLeng'),
        ruLeng = document.querySelector('#ruLeng'),
        esLeng = document.querySelector('#esLeng'),
        ptLeng = document.querySelector('#ptLeng');

    let locale = 'uk';

    if (ukLeng) locale = 'uk';
    if (ruLeng) locale = 'ru';
    if (enLeng) locale = 'en';
    if (esLeng) locale = 'es';
    if (ptLeng) locale = 'pt';

    let i18nData = {};

    function loadTranslations() {
        return fetch(`https://fav-prom.com/api_marge/translates/${locale}`).then(res => res.json())
            .then(json => {
                i18nData = json;
                translate();

                var mutationObserver = new MutationObserver(function (mutations) {
                    translate();
                });
                mutationObserver.observe(document.getElementById('marge'), {
                    childList: true,
                    subtree: true,
                });

            });
    }

    function translate() {
        const elems = document.querySelectorAll('[data-translate]')
        if (elems && elems.length) {
            elems.forEach(elem => {
                const key = elem.getAttribute('data-translate');
                elem.innerHTML = translateKey(key);
                elem.removeAttribute('data-translate');
            })

            let host;
            if (window && window.location) {
                host = window.location.host + '';
            }

            if (window && window.location && host.indexOf('favorit') > -1) {
                document.querySelectorAll('.host-ref').forEach(el => {
                    el.innerHTML = 'favorit.com.ua';

                    const a = el.closest('a');
                    if (a && a.href.indexOf('favbet') > -1) {
                        const href = a.href;
                        const afterDomain = href.split('favbet')[1].split('/')[1];

                        a.setAttribute('href', 'https://' + host + (afterDomain ? ('/' + afterDomain) : ''));
                    }


                })
            }
        }


        refreshLocalizedClass();
    }

    function translateKey(key) {
        if (!key) {
            return;
        }
        return i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
    }

    function refreshLocalizedClass(element, baseCssClass) {
        if (!element) {
            return;
        }
        for (const lang of ['en', 'uk', 'ru', 'es', 'pt']) {
            element.classList.remove(baseCssClass + lang);
        }
        element.classList.add(baseCssClass + locale);
    }

    const InitPage = () => {
        translate();
    }

    loadTranslations()
        .then(InitPage);

    let mainPage = document.querySelector('.fav__page');
    setTimeout(() => mainPage.classList.add('overflow'), 1000);

    const apiData = await fetch('https://fav-prom.com/api_marge/matches').then(res => res.json());

    const active = apiData.active;

    const rowActive = document.querySelector('.table__row.active');

    if (!!active) {
        rowActive.querySelector('.table__body-date').innerHTML = formatDate(active.matchDate);
        rowActive.querySelector('.table__body-team-1').setAttribute('data-translate', active.team1);
        rowActive.querySelector('.table__body-team-2').setAttribute('data-translate', active.team2);
    } else {
        rowActive.remove();
    }


    const soon = apiData.soon;
    const rowSoon = document.querySelector('.table__row.close');
    if (!soon) {
        rowSoon.remove();
    } else {
        if (rowSoon.querySelector('.table__body-team-1')) {
            rowSoon.querySelector('.table__body-team-1').remove();
        }
        if (rowSoon.querySelector('.table__body-team-line')) {
            rowSoon.querySelector('.table__body-team-line').remove();
        }
        if (rowSoon.querySelector('.table__body-team-2')) {
            rowSoon.querySelector('.table__body-team-2').remove();
        }

        rowSoon.querySelector('.table__body-date').innerHTML = formatDate(soon.matchDate);
        rowSoon.querySelector('.soonDate').innerHTML = ' ' + formatDate(soon.activeDate);
    }


    const finished = apiData.finished;
    const rowFinished = document.querySelector('.table__row.finished');
    rowFinished.querySelector('.table__body-date').innerHTML = formatDate(finished.matchDate);
    rowFinished.querySelector('.table__body-team-1').setAttribute('data-translate', finished.team1);
    rowFinished.querySelector('.table__body-team-2').setAttribute('data-translate', finished.team2);


    if (!!active) {

        const localizedLink = `/${locale}${active.link}`;
        document.querySelector('.table__btn').setAttribute('href', localizedLink);


        let favData = await fetch('/frontend_api2/', {
            method: 'POST',
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 16,
                "method": "frontend/market/get",
                "params": {
                    "by": {
                        "lang": 'en',
                        "service_id": 0,
                        "event_id": parseInt(active.matchId)
                    }
                }
            })
        })
            .then(res => res.json())

            .catch(error => {
                console.log(error);
            });

        let coefData = favData.result.find(o => o.market_name === '1 X 2');

        if (!coefData) {
            favData = await fetch('/frontend_api2/', {
                method: 'POST',
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "id": 16,
                    "method": "frontend/market/get",
                    "params": {
                        "by": {
                            "lang": 'en',
                            "service_id": 1,
                            "event_id": parseInt(active.matchId)
                        }
                    }
                })
            }).then(res => res.json());

            coefData = favData.result.find(o => o.market_name === '1 X 2');
        }

        if (!!coefData) {
            rowActive.querySelector('.first-coeff-1').innerHTML = (coefData.outcomes[0].outcome_coef * 0.95).toFixed(2);
            rowActive.querySelector('.first-coeff-2').innerHTML = (coefData.outcomes[0].outcome_coef).toFixed(2);
            rowActive.querySelector('.first-coeff-2').setAttribute('href', localizedLink);

            rowActive.querySelector('.center-coeff-1').innerHTML = (coefData.outcomes[1].outcome_coef * 0.95).toFixed(2);
            rowActive.querySelector('.center-coeff-2').innerHTML = (coefData.outcomes[1].outcome_coef).toFixed(2);
            rowActive.querySelector('.center-coeff-2').setAttribute('href', localizedLink);

            rowActive.querySelector('.second-coeff-1').innerHTML = (coefData.outcomes[2].outcome_coef * 0.95).toFixed(2);
            rowActive.querySelector('.second-coeff-2').innerHTML = (coefData.outcomes[2].outcome_coef).toFixed(2);
            rowActive.querySelector('.second-coeff-2').setAttribute('href', localizedLink);
        } else {
            rowActive.remove();
        }

    }

})();*/
"use strict";
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5OQTtBQ0FBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmZ1bmN0aW9uIGZvcm1hdERhdGUoZGF0ZSkge1xuICAgIGNvbnN0IGRhdGVPYmogPSBuZXcgRGF0ZShkYXRlKTtcbiAgICByZXR1cm4gZGF0ZU9iai5nZXREYXRlKCkgKyAnLicgKyAoZGF0ZU9iai5nZXRNb250aCgpIDwgOSA/ICcwJyA6ICcnKSArIChkYXRlT2JqLmdldE1vbnRoKCkgKyAxKVxufVxuXG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuXG4gICAgY29uc3QgdWtMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VrTGVuZycpLFxuICAgICAgICBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyksXG4gICAgICAgIHJ1TGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNydUxlbmcnKSxcbiAgICAgICAgZXNMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VzTGVuZycpLFxuICAgICAgICBwdExlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHRMZW5nJyk7XG5cbiAgICBsZXQgbG9jYWxlID0gJ3VrJztcblxuICAgIGlmICh1a0xlbmcpIGxvY2FsZSA9ICd1ayc7XG4gICAgaWYgKHJ1TGVuZykgbG9jYWxlID0gJ3J1JztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuICAgIGlmIChlc0xlbmcpIGxvY2FsZSA9ICdlcyc7XG4gICAgaWYgKHB0TGVuZykgbG9jYWxlID0gJ3B0JztcblxuICAgIGxldCBpMThuRGF0YSA9IHt9O1xuXG4gICAgZnVuY3Rpb24gbG9hZFRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwczovL2Zhdi1wcm9tLmNvbS9hcGlfbWFyZ2UvdHJhbnNsYXRlcy8ke2xvY2FsZX1gKS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFyZ2UnKSwge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cmFuc2xhdGVdJylcbiAgICAgICAgaWYgKGVsZW1zICYmIGVsZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHRyYW5zbGF0ZUtleShrZXkpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgbGV0IGhvc3Q7XG4gICAgICAgICAgICBpZiAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGhvc3QgPSB3aW5kb3cubG9jYXRpb24uaG9zdCArICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbiAmJiBob3N0LmluZGV4T2YoJ2Zhdm9yaXQnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhvc3QtcmVmJykuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVsLmlubmVySFRNTCA9ICdmYXZvcml0LmNvbS51YSc7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9IGVsLmNsb3Nlc3QoJ2EnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgJiYgYS5ocmVmLmluZGV4T2YoJ2ZhdmJldCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBhLmhyZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhZnRlckRvbWFpbiA9IGhyZWYuc3BsaXQoJ2ZhdmJldCcpWzFdLnNwbGl0KCcvJylbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdocmVmJywgJ2h0dHBzOi8vJyArIGhvc3QgKyAoYWZ0ZXJEb21haW4gPyAoJy8nICsgYWZ0ZXJEb21haW4pIDogJycpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICByZWZyZXNoTG9jYWxpemVkQ2xhc3MoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVLZXkoa2V5KSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGkxOG5EYXRhW2tleV0gfHwgJyotLS0tTkVFRCBUTyBCRSBUUkFOU0xBVEVELS0tLSogICBrZXk6ICAnICsga2V5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcyhlbGVtZW50LCBiYXNlQ3NzQ2xhc3MpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBsYW5nIG9mIFsnZW4nLCAndWsnLCAncnUnLCAnZXMnLCAncHQnXSkge1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGJhc2VDc3NDbGFzcyArIGxhbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChiYXNlQ3NzQ2xhc3MgKyBsb2NhbGUpO1xuICAgIH1cblxuICAgIGNvbnN0IEluaXRQYWdlID0gKCkgPT4ge1xuICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICB9XG5cbiAgICBsb2FkVHJhbnNsYXRpb25zKClcbiAgICAgICAgLnRoZW4oSW5pdFBhZ2UpO1xuXG4gICAgbGV0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhdl9fcGFnZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3cnKSwgMTAwMCk7XG5cbiAgICBjb25zdCBhcGlEYXRhID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaV9tYXJnZS9tYXRjaGVzJykudGhlbihyZXMgPT4gcmVzLmpzb24oKSk7XG5cbiAgICBjb25zdCBhY3RpdmUgPSBhcGlEYXRhLmFjdGl2ZTtcblxuICAgIGNvbnN0IHJvd0FjdGl2ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZV9fcm93LmFjdGl2ZScpO1xuXG4gICAgaWYgKCEhYWN0aXZlKSB7XG4gICAgICAgIHJvd0FjdGl2ZS5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2JvZHktZGF0ZScpLmlubmVySFRNTCA9IGZvcm1hdERhdGUoYWN0aXZlLm1hdGNoRGF0ZSk7XG4gICAgICAgIHJvd0FjdGl2ZS5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2JvZHktdGVhbS0xJykuc2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScsIGFjdGl2ZS50ZWFtMSk7XG4gICAgICAgIHJvd0FjdGl2ZS5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2JvZHktdGVhbS0yJykuc2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScsIGFjdGl2ZS50ZWFtMik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm93QWN0aXZlLnJlbW92ZSgpO1xuICAgIH1cblxuXG4gICAgY29uc3Qgc29vbiA9IGFwaURhdGEuc29vbjtcbiAgICBjb25zdCByb3dTb29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYmxlX19yb3cuY2xvc2UnKTtcbiAgICBpZiAoIXNvb24pIHtcbiAgICAgICAgcm93U29vbi5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocm93U29vbi5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2JvZHktdGVhbS0xJykpIHtcbiAgICAgICAgICAgIHJvd1Nvb24ucXVlcnlTZWxlY3RvcignLnRhYmxlX19ib2R5LXRlYW0tMScpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyb3dTb29uLnF1ZXJ5U2VsZWN0b3IoJy50YWJsZV9fYm9keS10ZWFtLWxpbmUnKSkge1xuICAgICAgICAgICAgcm93U29vbi5xdWVyeVNlbGVjdG9yKCcudGFibGVfX2JvZHktdGVhbS1saW5lJykucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvd1Nvb24ucXVlcnlTZWxlY3RvcignLnRhYmxlX19ib2R5LXRlYW0tMicpKSB7XG4gICAgICAgICAgICByb3dTb29uLnF1ZXJ5U2VsZWN0b3IoJy50YWJsZV9fYm9keS10ZWFtLTInKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvd1Nvb24ucXVlcnlTZWxlY3RvcignLnRhYmxlX19ib2R5LWRhdGUnKS5pbm5lckhUTUwgPSBmb3JtYXREYXRlKHNvb24ubWF0Y2hEYXRlKTtcbiAgICAgICAgcm93U29vbi5xdWVyeVNlbGVjdG9yKCcuc29vbkRhdGUnKS5pbm5lckhUTUwgPSAnICcgKyBmb3JtYXREYXRlKHNvb24uYWN0aXZlRGF0ZSk7XG4gICAgfVxuXG5cbiAgICBjb25zdCBmaW5pc2hlZCA9IGFwaURhdGEuZmluaXNoZWQ7XG4gICAgY29uc3Qgcm93RmluaXNoZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGVfX3Jvdy5maW5pc2hlZCcpO1xuICAgIHJvd0ZpbmlzaGVkLnF1ZXJ5U2VsZWN0b3IoJy50YWJsZV9fYm9keS1kYXRlJykuaW5uZXJIVE1MID0gZm9ybWF0RGF0ZShmaW5pc2hlZC5tYXRjaERhdGUpO1xuICAgIHJvd0ZpbmlzaGVkLnF1ZXJ5U2VsZWN0b3IoJy50YWJsZV9fYm9keS10ZWFtLTEnKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJywgZmluaXNoZWQudGVhbTEpO1xuICAgIHJvd0ZpbmlzaGVkLnF1ZXJ5U2VsZWN0b3IoJy50YWJsZV9fYm9keS10ZWFtLTInKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJywgZmluaXNoZWQudGVhbTIpO1xuXG5cbiAgICBpZiAoISFhY3RpdmUpIHtcblxuICAgICAgICBjb25zdCBsb2NhbGl6ZWRMaW5rID0gYC8ke2xvY2FsZX0ke2FjdGl2ZS5saW5rfWA7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJsZV9fYnRuJykuc2V0QXR0cmlidXRlKCdocmVmJywgbG9jYWxpemVkTGluayk7XG5cblxuICAgICAgICBsZXQgZmF2RGF0YSA9IGF3YWl0IGZldGNoKCcvZnJvbnRlbmRfYXBpMi8nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBcImpzb25ycGNcIjogXCIyLjBcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IDE2LFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiZnJvbnRlbmQvbWFya2V0L2dldFwiLFxuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhbmdcIjogJ2VuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZV9pZFwiOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJldmVudF9pZFwiOiBwYXJzZUludChhY3RpdmUubWF0Y2hJZClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcblxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBsZXQgY29lZkRhdGEgPSBmYXZEYXRhLnJlc3VsdC5maW5kKG8gPT4gby5tYXJrZXRfbmFtZSA9PT0gJzEgWCAyJyk7XG5cbiAgICAgICAgaWYgKCFjb2VmRGF0YSkge1xuICAgICAgICAgICAgZmF2RGF0YSA9IGF3YWl0IGZldGNoKCcvZnJvbnRlbmRfYXBpMi8nLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICBcImpzb25ycGNcIjogXCIyLjBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiAxNixcbiAgICAgICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJmcm9udGVuZC9tYXJrZXQvZ2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYnlcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFuZ1wiOiAnZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZV9pZFwiOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXZlbnRfaWRcIjogcGFyc2VJbnQoYWN0aXZlLm1hdGNoSWQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSk7XG5cbiAgICAgICAgICAgIGNvZWZEYXRhID0gZmF2RGF0YS5yZXN1bHQuZmluZChvID0+IG8ubWFya2V0X25hbWUgPT09ICcxIFggMicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEhY29lZkRhdGEpIHtcbiAgICAgICAgICAgIHJvd0FjdGl2ZS5xdWVyeVNlbGVjdG9yKCcuZmlyc3QtY29lZmYtMScpLmlubmVySFRNTCA9IChjb2VmRGF0YS5vdXRjb21lc1swXS5vdXRjb21lX2NvZWYgKiAwLjk1KS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgcm93QWN0aXZlLnF1ZXJ5U2VsZWN0b3IoJy5maXJzdC1jb2VmZi0yJykuaW5uZXJIVE1MID0gKGNvZWZEYXRhLm91dGNvbWVzWzBdLm91dGNvbWVfY29lZikudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIHJvd0FjdGl2ZS5xdWVyeVNlbGVjdG9yKCcuZmlyc3QtY29lZmYtMicpLnNldEF0dHJpYnV0ZSgnaHJlZicsIGxvY2FsaXplZExpbmspO1xuXG4gICAgICAgICAgICByb3dBY3RpdmUucXVlcnlTZWxlY3RvcignLmNlbnRlci1jb2VmZi0xJykuaW5uZXJIVE1MID0gKGNvZWZEYXRhLm91dGNvbWVzWzFdLm91dGNvbWVfY29lZiAqIDAuOTUpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICByb3dBY3RpdmUucXVlcnlTZWxlY3RvcignLmNlbnRlci1jb2VmZi0yJykuaW5uZXJIVE1MID0gKGNvZWZEYXRhLm91dGNvbWVzWzFdLm91dGNvbWVfY29lZikudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIHJvd0FjdGl2ZS5xdWVyeVNlbGVjdG9yKCcuY2VudGVyLWNvZWZmLTInKS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBsb2NhbGl6ZWRMaW5rKTtcblxuICAgICAgICAgICAgcm93QWN0aXZlLnF1ZXJ5U2VsZWN0b3IoJy5zZWNvbmQtY29lZmYtMScpLmlubmVySFRNTCA9IChjb2VmRGF0YS5vdXRjb21lc1syXS5vdXRjb21lX2NvZWYgKiAwLjk1KS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgcm93QWN0aXZlLnF1ZXJ5U2VsZWN0b3IoJy5zZWNvbmQtY29lZmYtMicpLmlubmVySFRNTCA9IChjb2VmRGF0YS5vdXRjb21lc1syXS5vdXRjb21lX2NvZWYpLnRvRml4ZWQoMik7XG4gICAgICAgICAgICByb3dBY3RpdmUucXVlcnlTZWxlY3RvcignLnNlY29uZC1jb2VmZi0yJykuc2V0QXR0cmlidXRlKCdocmVmJywgbG9jYWxpemVkTGluayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByb3dBY3RpdmUucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSkoKTsqL1xuIiwiIl19
