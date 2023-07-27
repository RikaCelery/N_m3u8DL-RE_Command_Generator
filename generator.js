function changeColor() {
    document.body.classList.toggle('dark')
    return
}
const animate = gsap.timeline({ paused: true });
const animateBackground = new TimelineMax({ paused: true });
let toggle = true;

animateBackground
    .set(".switch", { boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)" })
    .to(".text p", 0.1, { color: "#FFF" }, 0.1);

animate
    .set(".circle", { backgroundColor: "rgba(0,0,0,0)" }, 0.2)
    .to(".toggle-button", 0.1, { scale: 0.7 }, 0)
    .set(".toggle", { backgroundColor: "#FFF" })
    .to(".moon-mask", 0.2, { translateY: 20, translateX: -10 }, 0.3)
    .to(".toggle-button", 0.1, { translateY: 49 }, 0.1)
    .to(".toggle-button", 0.1, { scale: 0.9 })

document.getElementsByClassName("switch")[0].addEventListener("click", () => {
    if (toggle) {
        animate.restart();
        animateBackground.restart();
    } else {
        animate.reverse();
        animateBackground.reverse();
    }
    toggle = !toggle;
    changeColor()
});

function insert(pos, id, placeholder) {
    let input = document.createElement('input')
    input.type = 'text'
    input.id = id
    input.placeholder = placeholder
    input.oninput = () => { generate('generator_body') }
    document.querySelector(pos).appendChild(input)
}
function removeLast(pos) {
    console.log(document.querySelector(pos).lastChild.tagName);
    if (document.querySelector(pos).lastChild.tagName != 'INPUT') {
        return
    }
    document.querySelector(pos).removeChild(document.querySelector(pos).lastChild)
}
function generate(params) {
    let form = document.getElementById(params)
    // console.log(form)
    let list = form.querySelectorAll('input')
    let finalArgs = []
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        switch (element.type) {
            case 'text':
                if (element.value.length != 0) {
                    if (element.id != 'input') {
                        finalArgs.push('--' + element.id + ' "' + element.value + '"')

                    } else {
                        finalArgs.push('"' + element.value + '"')
                    }
                }
                break;
            case 'checkbox':

                if (element.checked != Boolean(element.getAttribute('default'))) {
                    finalArgs.push('--' + element.id)
                    finalArgs.push(String(element.checked))
                }
                break;

            default:
                break;
        }
        // console.log(element.type + ' ' + element.id + ' value:[' + element.value + '] ' + element.placeholder)
    }
    let list2 = form.querySelectorAll('select')
    for (let index = 0; index < list2.length; index++) {
        const element = list2[index];
        let opt = element.options[element.selectedIndex]
        if (opt.value === '' || opt.hidden) {
            // console.log(element.type + ' ' + element.id + ' ' + 'hidden')
        } else {
            if (element.value.length != 0) {
                finalArgs.push('--' + element.id + ' "' + opt.value + '"')
            }
            // console.log(element.type + ' ' + element.id + ' ' + opt.value)
        }
    }
    document.getElementById('output').textContent = 'N_m3u8DL-RE.exe ' + finalArgs.join(" ")
    console.log(finalArgs.join(" "))
}
generate('generator_body')
for (const input of document.querySelectorAll('input')) {
    input.addEventListener('input', () => generate('generator_body'))
}