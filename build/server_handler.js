let CONFIG_CACHE = {};

const CheckConfigHeap = () => {
    const configIni = fs.readFileSync(CONFIG_PARSER_CONFIG.FILE_PATH, 'utf8');
    const configIniSize = Buffer.byteLength(configIni, 'utf8');
    const configMaxHeap = parseInt(CONFIG_PARSER_CONFIG.CONFIG_MAX_HEAP.replace('M', ''));
    if (configIniSize > configMaxHeap * 1024 * 1024) {
        console.log(`WARNING: The config.ini is ${configIniSize / 1024 / 1024}MB, which is bigger than the max heap size of ${CONFIG_PARSER_CONFIG.CONFIG_MAX_HEAP}MB.`);
    }
}

const ReloadConfigCache = async () => {
    CONFIG_CACHE = {};
    const configIni = fs.readFileSync(CONFIG_PARSER_CONFIG.FILE_PATH, 'utf8');
    const configIniSize = Buffer.byteLength(configIni, 'utf8');
    const configMaxHeap = parseInt(CONFIG_PARSER_CONFIG.CONFIG_MAX_HEAP.replace('M', ''));
    if (configIniSize > configMaxHeap * 1024 * 1024) {
        console.log(`WARNING: The config.ini is ${configIniSize / 1024 / 1024}MB, which is bigger than the max heap size of ${CONFIG_PARSER_CONFIG.CONFIG_MAX_HEAP}MB.`);
    }
    const configIniLines = configIni.split('\n');
    for (let i = 0; i < configIniLines.length; i++) {
        const configIniLine = configIniLines[i];
        if (configIniLine.indexOf('[') != -1) {
            const configIniSection = configIniLine.substring(configIniLine.indexOf('[') + 1, configIniLine.indexOf(']'));
            CONFIG_CACHE[configIniSection] = {};
        } else if (configIniLine.indexOf('=') != -1) {
            const configIniKey = configIniLine.substring(0, configIniLine.indexOf('='));
            const configIniValue = configIniLine.substring(configIniLine.indexOf('=') + 1);
            CONFIG_CACHE[configIniSection][configIniKey] = configIniValue;
        }
    }
}

const LoadConfigCache = async () => {
    const configIni = fs.readFileSync(CONFIG_PARSER_CONFIG.FILE_PATH, 'utf8');
    const configIniSize = Buffer.byteLength(configIni, 'utf8');
    if (configIniSize > 0) {
        const configIniLines = configIni.split('\n');
        for (let i = 0; i < configIniLines.length; i++) {
            const configIniLine = configIniLines[i];
            if (configIniLine.indexOf('=') != -1) {
                const configIniKey = configIniLine.substring(0, configIniLine.indexOf('='));
                const configIniValue = configIniLine.substring(configIniLine.indexOf('=') + 1);
                CONFIG_CACHE[configIniKey] = configIniValue;
            }
        }
    }
}

const GetCacheValue = (key) => {
    return CONFIG_CACHE[key];
}

const GetConfigData = (pKey) => {
    CheckConfigHeap();
    const configIni = fs.readFileSync(CONFIG_PARSER_CONFIG.FILE_PATH, 'utf8');
    const configIniLines = configIni.split('\n');
    const configIniLinesLength = configIniLines.length;
    for (let i = 0; i < configIniLinesLength; i++) {
        const configIniLine = configIniLines[i];
        const configIniLineLength = configIniLine.length;
        if (configIniLine.indexOf('[') == 0) {
            const configIniLineName = configIniLine.substring(1, configIniLine.indexOf(']'));
            if (configIniLineName == pKey) {
                let configIniLineValues = [];
                for (let j = i + 1; j < configIniLinesLength; j++) {
                    const configIniLineValue = configIniLines[j];
                    if (configIniLineValue.indexOf('[') == 0) break;
                    configIniLineValues.push(configIniLineValue);
                }
                for (let j = 0; j < configIniLineValues.length; j++) {
                    configIniLineValues[j] = configIniLineValues[j].replace(/\\/g, '');
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    configIniLineValues[j] = configIniLineValues[j].replace(/\"/g, '');
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].length == 0) {
                        configIniLineValues.splice(j, 1);
                        j--;
                    }
                }
                for (let j = 0; j < configIniLineValues.length; j++) {
                    configIniLineValues[j] = configIniLineValues[j].replace(/^\"/, '');
                    configIniLineValues[j] = configIniLineValues[j].replace(/\"$/, '');
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    configIniLineValues[j] = configIniLineValues[j].replace(/^\s+|\s+$/g, '');
                }
                
                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].indexOf('"') == 0 && configIniLineValues[j].lastIndexOf('"') == configIniLineValues[j].length - 1) {
                        configIniLineValues[j] = configIniLineValues[j].substring(1, configIniLineValues[j].length - 1);
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].indexOf('=') != -1) {
                        const configIniLineValueName = configIniLineValues[j].substring(0, configIniLineValues[j].indexOf('='));
                        const configIniLineValueValue = configIniLineValues[j].substring(configIniLineValues[j].indexOf('=') + 1);
                        configIniLineValues[j] = {
                            name: configIniLineValueName,
                            value: configIniLineValueValue
                        }
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].value.indexOf(' ') == 0) {
                        configIniLineValues[j].value = configIniLineValues[j].value.substring(1);
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].value.lastIndexOf('"') == configIniLineValues[j].value.length - 1) {
                        configIniLineValues[j].value = configIniLineValues[j].value.substring(0, configIniLineValues[j].value.length - 1);
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].name.indexOf('[') != -1 || configIniLineValues[j].name.indexOf(']') != -1) {
                        console.log(`WARNING: The config.ini has a brackets in the key name of the key "${pKey}".`);
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].value.indexOf('{') != -1 || configIniLineValues[j].value.indexOf('}') != -1) {
                        try {
                            JSON.parse(configIniLineValues[j].value);
                        }
                        catch (e) {
                            console.log(`WARNING: The config.ini has a invalid json in the value of the key "${pKey}".`);
                        }
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].value.toLowerCase() == 'yes') {
                        configIniLineValues[j].value = true;
                    }
                    else if (configIniLineValues[j].value.toLowerCase() == 'no') {
                        configIniLineValues[j].value = false;
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].value.length == 0) {
                        console.log(`WARNING: The config.ini has a empty value in the key "${pKey}".`);
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].value.length > 1024 * 1024) {
                        console.log(`WARNING: The config.ini has a value of the key "${pKey}" is ${configIniLineValues[j].value.length / 1024 / 1024}MB, which is bigger than 1MB.`);
                    }
                }

                for (let j = 0; j < configIniLineValues.length; j++) {
                    if (configIniLineValues[j].value.match(/[\u0600-\u06FF]/g)) {
                        configIniLineValues[j].value = configIniLineValues[j].value.replace(/[\u0600-\u06FF]/g, function (a) {
                            return '\\u' + ('000' + a.charCodeAt(0).toString(16)).substr(-4);
                        });
                    }
                }
   
                return configIniLineValues;
            }

        }
    }
}

on("onResourceStart", (resourceName) => {
    if(GetCurrentResourceName() != resourceName) {
      return;
    }
  
    LoadConfigCache();
  });

exports("GetConfigData", GetConfigData);
