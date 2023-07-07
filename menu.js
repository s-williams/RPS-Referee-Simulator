loadFont("pixelFont", "fonts/PixelOperatorMono8.ttf")

scene("menu", (hiScore = 0) => {
    add([
        text("$" + String(0), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() - 5, 5),
        color(0, 0, 0),
        anchor("topright")
    ]);
    add([
        text("HI $" + String(hiScore), {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(5, 5),
        color(0, 0, 0),
        anchor("topleft")
    ]);
    add([
        text("REFEREE SIMULATOR", {
            size: FONT_SIZE * 2,
            font: "pixelFont"
        }),
        pos(width() / 2, 200),
        color(0, 0, 0),
        anchor("center")
    ]);

    // Start text
    let startText = add([
        text("Click to Start", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(240, 260),
        anchor("center"),
        area(),
        color(0, 0, 0),
        "start",
    ]);
    onClick("start", () => { go("main", hiScore); });
    loop(1, () => {
        startText.opacity = startText.opacity == 1 ? 0 : 1;
    });

    // Credits
    add([
        text("Credits", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(240, height() - 30),
        anchor("bot"),
        area(),
        color(0, 0, 0),
        "credits"
    ]);
    onClick("credits", () => { go("credits", hiScore); });
    // Music and SFX mute buttons
    const musicText = add([
        text(musicMuted ? "Muted" : "Music", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(30, height() - 30),
        anchor("botleft"),
        area(),
        color(0, 0, 0),
        "musicText"
    ]);
    onClick("musicText", () => {
        toggleMusic();
    });
    let toggleMusic = () => {
        musicMuted = !musicMuted;
        musicText.text = musicMuted ? "Muted" : "Music";
    }
    const sfxText = add([
        text(sfxMuted ? "Muted" : "SFX", {
            size: FONT_SIZE,
            font: "pixelFont"
        }),
        pos(width() - 30, height() - 30),
        anchor("botright"),
        area(),
        color(0, 0, 0),
        "sfxText"
    ]);
    onClick("sfxText", () => {
        toggleSfx();
    });
    let toggleSfx = () => {
        sfxMuted = !sfxMuted;
        sfxText.text = sfxMuted ? "Muted" : "SFX";
    }

    onKeyPress("space", () => { go("main", hiScore); });
    onKeyPress("r", () => { go("main", hiScore); });
    onKeyPress("enter", () => { go("main", hiScore); });
    onKeyPress("escape", () => { go("menu", hiScore); });
    onKeyPress("1", () => { toggleMusic() });
    onKeyPress("2", () => { go('credits', hiScore); });
    onKeyPress("3", () => { toggleSfx(); });
});

go("menu");