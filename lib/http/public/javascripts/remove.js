function onRestartAllActive() {
    $.post('/actions/restart-active')
        .done(data => {
            console.log(data)
        })
        .fail(error => {
            console.log(error)
        })
}

function onRestartAllFailed() {
    $.post('/actions/restart-failed')
        .done(data => {
            console.log(data)
        })
        .fail(error => {
            console.log(error)
        })
}

function onDeleteAllComplete() {
    $.post('/actions/remove-complete')
        .done(data => {
            console.log(data)
        })
        .fail(error => {
            console.log(error)
        })
}