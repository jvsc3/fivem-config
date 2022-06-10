RegisterCommand("conf:test", (source) => {
    let example = GetConfigData("messages")
    let kickMessage = example.kicked

    DropPlayer(source, kickMessage)
});