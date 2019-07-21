# API Challenge

Hello !

This is my Meteor based solution for your REST api challenge. To run this project you will need to install `meteor`

## Quick Installation

On Windows, the installer can be found at https://www.meteor.com/install.

On Linux/macOS, use this line:

```bash
curl https://install.meteor.com/ | sh
```

Clone project:

```bash
git clone https://github.com/McManford/API_Challenge.git
```

Due to some packaging error I can't figure out, install the additional `npm` packages:

```bash
cd API_Challenge
meteor npm install --save fuzzy-matching
```

Run it, by default it runs on port 3000:

```bash
meteor run
```

(Optional) Run it with a particular port, example for running on port 53900:

```bash
meteor run --port=53900
```
