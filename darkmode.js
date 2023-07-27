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
