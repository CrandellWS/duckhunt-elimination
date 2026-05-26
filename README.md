# Duck Hunt: Elimination Mode

A fork of [MattSurabian/DuckHunt-JS](https://github.com/MattSurabian/DuckHunt-JS) with a "last duck standing" elimination mode for stream giveaways and chat rooms.

## How elimination mode works

1. On the setup screen, paste a list of names (one per line, 3+ required).
2. Each duck that spawns is secretly assigned a name. Names are **hidden** while ducks fly.
3. Shot a duck → its name is revealed and that person is eliminated. **Missed ducks survive** the round and stay in the pool.
4. Game cycles waves until exactly one name remains — that's the winner.

The original classic mode is still available via the "Play Classic" button on the setup screen.

## Deploy to GitHub Pages

This repo includes a workflow at `.github/workflows/pages.yml` that builds and publishes the game to GitHub Pages on every push to `main`/`master`.

One-time setup after pushing:
1. GitHub → repo Settings → Pages → **Source: GitHub Actions**
2. Push to `main`. The workflow builds with webpack and publishes `dist/` to Pages.
3. The game will be live at `https://<your-user>.github.io/<repo-name>/`.

You can also run the workflow manually from the Actions tab (`workflow_dispatch`).

---

## Original DuckHunt-JS README

[Play the original game](https://duckhuntjs.com)

This is an implementation of DuckHunt in Javascript and HTML5. It uses the PixiJS rendering engine, Green Sock Animations, Howler, and Bluebird Promises.

## Rendering
This game supports WebGL and Canvas rendering via the PixiJS rendering engine.

## Audio
This game will attempt to use the WebAudioAPI and fallback to HTML5 Audio if necessary. Audio is loaded and controlled via HowlerJS.

## Tweening
The animations in this game are a combination of PixiJS MovieClips built from sprite images and tweens. Since PixiJS doesn't provide a tweening API, Green Sock was used.

## Game Logic
The flow of this game is managed using Javascript. The main chunks of business logic are implemented as ES6 classes which are transpiled to ES5 using Babel.

## Working With This Repo

 - You must have [nodejs](https://nodejs.org/) installed.
 - Clone the repo into a directory of your choice
 - `cd` into that directory and run `npm install`
 - Use `npm start` to start a local webserver which will make the site available at http://localhost:8080/. Cross origin errors prevent this project from being accessed in the browser with the `file://` protocol. This will also trigger automatic builds and reloads of the page when changes are detected in the `src` directory.
 - If you want to manually cut a build of the application code run `npm run build`
 
## Working With Audio and Visual Assets
This repo ships with committed dist files to make it easy for developers to get up and running. If you really want to get into some leet haxing and change the way
this game looks and sounds then you'll need to work with audio and image sprites. The following tasks make that possible: 

 - To rebuild audio assets use `npm run audio` (there is a hard dependency on [ffmpeg](https://ffmpeg.org/download.html) to run this task)
 - To rebuild image assets use `npm run images` (there is a hard dependency on [texturepacker](https://www.codeandweb.com/texturepacker/download) to run this task)

## Bugs
Please report bugs as [issues](https://github.com/MattSurabian/DuckHunt-JS/issues).

## Contributing
Pull requests are welcome! Please ensure code style and quality compliance with `npm run lint` and include any built files.
