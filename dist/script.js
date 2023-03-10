const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);

onload = () => {
    fetch("https://api.lyrics.ovh/v1/Sub%20Urban/Cradles")
        .then(resp => {
            resp.json()
        })
        .then(data => makeLyrics(data, "Cradles"))
        .catch(err => Toast({
            enableIcon: true,
            icon: {
                type: "cross"
            },
            position: "bottom-left",
            animation: "Left",
            text: "Oops! Something went wrong with the API. Please try again later.",
            theme: "glass",
            timer: 6500
        }));
    document.form.onsubmit = async e => {
        const response = await fetch(".");
        if (response.status >= 200 && response.status < 500) {
            $(".loader").classList.remove("hide");
            document.form.search.removeFocus();
            e.preventDefault();
            if ($(".main__tracks")) {
                $(".main__tracks").remove();
            }
            if ($(".main__lyrics")) {
                $(".main__lyrics").remove();
            }
            let value = document.form.search.value.trim();
            fetch("https://api.lyrics.ovh/suggest/" + value)
                .then(resp => {
                    resp.json();
                })
                .then(data => {
                    makeTracks(data.data);
                    $(".loader").classList.add("hide");
                }).catch(err => Toast({
                    enableIcon: true,
                    icon: {
                        type: "cross"
                    },
                    position: "bottom-left",
                    animation: "Left",
                    text: "Oops! Something went wrong. Please try again later.",
                    theme: "glass",
                    timer: 6500,
                    onClose: () => $(".loader").classList.add("hide")
                }));
            document.form.search.value = "";
        } else {
            Toast({
                enableIcon: true,
                icon: {
                    type: "warning"
                },
                position: "bottom-left",
                animation: "Left",
                text: "Oops! Internet Connection Lost",
                theme: "glass",
                timer: 6500
            });
        }
        $(".loader").classList.add("hide");
    }
}

const makeTracks = tracks => {
    let ul = document.createElement("ul");
    ul.classList.add("main__tracks");
    for (let i = 0; i < tracks.length; i++) {
        ul.innerHTML += `<li class="main__tracks__track">
                   <div class="main__tracks__track__container">
                      <h3 class="main__tracks__track__container__name">
                          ${tracks[i].title}
                      </h3>
                      <p class="main__tracks__track__container__creator">
                          ${tracks[i].artist.name}
                      </p>
                  </div>
                  <button class="main__tracks__track__button" data-id="${i}">
                      Show Lyrics
                      <i class="material-icons">
                          keyboard_arrow_right
                      </i>
                  </button>
              </li>`;
    }
    $(".main").appendChild(ul);
    $$(".main__tracks__track__button").forEach(btn => {
        btn.onclick = () => {
            $(".loader").classList.remove("hide");
            let data = btn.getAttribute("data-id");
            let name = $$(".main__tracks__track__container__name")[data].innerText;
            let creator = $$(".main__tracks__track__container__creator")[data].innerText;
            fetch("https://api.lyrics.ovh/v1/" + creator + "/" + name)
                .then(resp => {
                    resp.json();
                })
                .then(data => {
                    makeLyrics(data, name);
                    $(".loader").classList.add("hide");
                }).catch(err =>
                    Toast({
                        enableIcon: true,
                        icon: {
                            type: "cross"
                        },
                        position: "bottom-left",
                        animation: "Left",
                        text: "Oops! Something went wrong. Please try again later.",
                        theme: "glass",
                        timer: 6500
                    }));
            $(".main__tracks").remove();
        }
    });
}

const makeLyrics = (lyric, songName) => {
    let lyrics = document.createElement("div");
    lyrics.classList.add("main__lyrics");
    lyrics.innerHTML = `<h1 class="main__lyrics__name">
        ${songName}
    </h1>
                        <p class="main__lyrics__lyric">
                            ${lyric.lyrics}
                        </p>
                        <button class="main__lyrics__copyBtn">
                            Copy Lyrics
                        </button>`;
    $(".main").appendChild(lyrics);
    $(".main__lyrics__copyBtn").onclick = () => {
        try {
            let input = document.createElement("input");
            document.body.appendChild(input);
            input.value = lyric.lyrics;
            input.select();
            document.execCommand("copy");
            input.remove();
            Toast({
                enableIcon: true,
                position: "bottom-right",
                animation: "Right",
                text: "The lyrics has been copied successfully",
                theme: "glass",
                timer: 6500
            })
        } catch {
            Toast({
                enableIcon: true,
                icon: {
                    type: "cross"
                },
                position: "bottom-left",
                animation: "Left",
                text: "Oops! Something went wrong. Please try again later.",
                theme: "glass",
                timer: 6500
            });
        }
    }
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../sw.js");
    console.log("Service Worker Registered!");
}