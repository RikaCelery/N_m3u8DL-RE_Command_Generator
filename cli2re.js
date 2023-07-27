/**
 * 
 * @param {String} prefix 
 * @returns {String}
 */
String.prototype.removePrefix = function (prefix) {
    if (this.match('^' + prefix + '.*$')) {
        return this.substring(prefix.length)
    } else {
        return this.toString()
    }
}
/**
 * 
 * @param {String} suffix 
 * @returns {String}
 */
String.prototype.removeSuffix = function (suffix) {
    if (this.match('^.*' + suffix + '$')) {
        return this.substring(0, prefix.length)
    } else {
        return this.toString()
    }
}


function logOut(...any) {
    console.log(...any);
}

/**
 * @param commandLine{String}
 */
function convert(commandLine) {
    cleanInfoBox()
    const args = {
        prefix: "",
        /** 
         * @type {String[]}
        */
        options: [

        ]
    }
    /**
     * @type {String[]}
     */
    let firstArgPos = commandLine.indexOf(' ', commandLine.indexOf('N_M3U8DL-CLI'))
    args.prefix = commandLine.substring(0, firstArgPos)
    let options = Array.from(commandLine.substring(firstArgPos).matchAll('(?:((?:[^"]|^)[\\S\s]+(?:[^"]|$)))|(?:"([^"]+)")')).map((e) => {
        return (e[2] ? e[2] : e[1]).trim().removePrefix('--')
    })
    logOut(options);

    class Element {
        hasArg = false
        _drop = false
        replacer = (old) => ''
        indexInc = (old) => { if (this.hasArg) return 1; else return 0 }
        /**
         * @param {Boolean} hasArg  
         * @param {Boolean|(old:String)=>Boolean} drop  
         * @param {(old:String)=>String|String} replacer  
         * @param {(old:String)=>number|undefined} inc  
         * */
        constructor(hasArg, drop, replacer, inc) {
            this.hasArg = hasArg
            this._drop = drop
            this.replacer = replacer
            if (inc) {
                this.indexInc = inc
            }
        }
        drop(old) {
            if (typeof this._drop == "boolean") {
                return this._drop
            } else
                return this._drop(this.replacer(old))
        }
    }
    let map = {
        "workDir": new Element(
            true, false, (old) => 'save-dir'
        ),
        saveName: new Element(
            true, false, (old) => 'save-name'
        ),
        baseUrl: new Element(
            true, false, (old) => 'base-url'
        ),
        headers: new Element(
            true, false, (old) => {
                return old.split('|').map((kv) => {
                    return `--header ${kv.substring(0, kv.indexOf(':'))}: ${kv.substring(kv.indexOf(':'))}`
                }).join(' ')
            }
        ),
        maxThreads: new Element(
            true, (old) =>
            args.options.includes('--thread-count')
            , (old) => 'thread-count'
        ),
        minThreads: new Element(
            true, (old) =>
            args.options.includes('--thread-count')
            , (old) => 'thread-count'
        ),
        retryCount: new Element(
            true, false, (old) => 'download-retry-count'
        ),
        timeOut: new Element(
            true, true
        ),
        muxSetJson: new Element(
            true, true, (old) => 'mux-import'
        ),
        useKeyFile: new Element(
            true, false, (old) => 'custom-hls-key'
        ),
        useKeyBase64: new Element(
            true, false, (old) => 'custom-hls-key'
        ),
        useKeyIV: new Element(
            true, false, (old) => 'custom-hls-iv'
        ),
        downloadRange: new Element(
            true, false, (old) => 'custom-range'
        ),
        liveRecDur: new Element(
            true, false, (old) => 'live-record-limit'
        ),
        stopSpeed: new Element(
            true, true
        ),
        maxSpeed: new Element(
            true, true
        ),
        proxyAddress: new Element(
            true, false, (old) => 'custom-proxy'
        ),
        enableDelAfterDone: new Element(
            false, false, (old) => 'del-after-done'
        ),
        enableMuxFastStart: new Element(
            false, true, (old) => ''
        ),
        enableBinaryMerge: new Element(
            false, false, (old) => 'binary-merge'
        ),
        enableParseOnly: new Element(
            false, false, (old) => 'drop-audio .* drop-subtitle .*'
        ),
        disableDateInfo: new Element(
            false, false, (old) => 'no-date-info'
        ),
        disableIntegrityCheck: new Element(
            false, false, (old) => 'check-segments-count False'
        ),
        noMerge: new Element(
            false, false, (old) => 'skip-merge'
        ),
        noProxy: new Element(
            false, false, (old) => 'use-system-proxy False'
        ),
        chaCha20KeyBase64: new Element(
            true, true, (old) => ''
        ),
        chaCha20NonceBase64: new Element(
            true, true, (old) => ''
        ),
    }
    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        logOut(opt)
        /**
         * @type {Element}
         */
        const ele = map[opt]
        if (!ele) {
            logOut(`${opt}(unknown)`)
            writeInfo('--' + opt,'',"unknown",'unknown')
            continue
        }
        let drop = ele.drop(opt)
        if (drop) {
            logOut(` --${opt}(drop)`);
        } else {
            args.options.push(`--${ele.replacer(opt)}`)
            logOut(`--${opt} => --${ele.replacer(opt)}`);
        }

        logOut(`  hasArg ${ele.hasArg}`);
        logOut(`  indexInc ${ele.indexInc(opt)}`);
        let option = ""
        for (let j = i + 1; j <= i + ele.indexInc(opt); j++) {
            const element = options[j];
            if (!drop) {
                option+=element
                args.options.push(`"${element}"`)
                logOut(`    arg: "${element}"`);
            } else {
                logOut(`    arg: ${element}(drop)`);
            }
        }
        if(drop){
            writeInfo('--' + opt,option,"drop","droped")
        }else{
            writeInfo('--' + opt,option,"ok")
        }

        i += ele.indexInc(opt)

    }



    if (args.prefix + ' ' + args.options.join(' ').length == 0)
        return '转换后的RE命令行将会显示在这里'
    return (args.prefix + ' ' + args.options.join(' '));
}

function cleanInfoBox() {
    document.getElementById('info-box').innerHTML = ''

}

function writeInfo(argName, argOption, type, details) {
    let box = document.getElementById('info-box')
    let info = document.createElement('div')
    info.classList.add("info")
    info.classList.add(type)
    let name = document.createElement('div')
    name.classList.add('arg-name')
    if (details) {
        name.innerText = argName + `(${details})`
    }else{
        name.innerText = argName
    }
    let option = document.createElement('div')
    option.classList.add('arg-option')
    option.innerText = argOption
    info.appendChild(name)
    info.appendChild(option)
    box.appendChild(info)
}