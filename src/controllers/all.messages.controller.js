exports.handleCommonText = (req, res) => {
    let body = req.body;
    if (body) {
        console.log(body);
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
}

exports.handleCommonImage = (req, res) => {
    let body = req.body;
    if (body) {
        console.log(body);
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
}

exports.handleCommonVideo = (req, res) => {
    let body = req.body;
    if (body) {
        console.log(body);
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
}

exports.handleCommonSticker = (req, res) => {
    let body = req.body;
    if (body) {
        console.log(body);
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
}

exports.handleCommonDocument = (req, res) => {
    let body = req.body;
    if (body) {
        console.log(body);
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
}