const speechRecognition = window.webkitSpeechRecognition
const recognition = new speechRecognition()
const textbox = $("#textbox")
const textbox2 = $("#textbox2")
const instructions = $("#instructions")
let roboName = "RoboBuddy"
let notSpeaking = true
function voiceEndCallback() {
    notSpeaking = true
    recognition.start()
}
 
const parameters = {
    onend: voiceEndCallback
}

recognition.continuous = true
//window.speechSynthesis.getVoices()

recognition.onstart = () => instructions.text("Voice recognition is on")

recognition.addEventListener('end', () => {
    if (notSpeaking) recognition.start()
})

recognition.onerror = () => instructions.text("Error")

recognition.onresult = (event) => {
    let current = event.resultIndex
    let message = event.results[current][0].transcript
    textbox2.val("")
    textbox.val(message)
    message = simplify(message)
    checkAllInputs(message, map)
}

$("#start-btn").click( () => recognition.start())

function simplify(message){
    let mapObj = {hello:"hi",hey:"hi",greetings:"hi",is:'',i:'',the:'',a:'',of:'',are:''}
    let re = new RegExp("\\b(?:" + Object.keys(mapObj).join("|") + ")\\b","gi")
    message = message.replace(re, (matched) => mapObj[matched.toLowerCase()])
    message = message.replace(/\s\s+/g,' ').trim().toLowerCase()
    return message
}

function say(result, string){
    textbox2.val(result)
    let msg = result
    //const voices = window.speechSynthesis.getVoices()
    //const msg = new SpeechSynthesisUtterance(result)
    //msg.voice = voices[11]
    if (result === "NAMECHANGE"){
        roboName = string.split(" ").pop().charAt(0).toUpperCase() + string.split(' ').pop().slice(1)
        textbox2.val(`Ok I am now ${roboName}`)
        //msg.text = (`Ok I am now ${roboName}`)
        msg = `Ok I am now ${roboName}`
        map.set("hi",`Hello I am ${roboName}`)
        document.getElementsByClassName("text-center mt-5")[0].innerHTML = `${roboName}`
    }
    //speechSynthesis.speak(msg)
    responsiveVoice.speak(msg, "UK English Female", parameters)
    notSpeaking = false
    recognition.stop()
}

function checkAllInputs(string, map){
    const keys = Array.from(map.keys()).sort( (a, b) => b.split(' ').length - a.split(' ').length)
    for (key of keys){
        const re = new RegExp("(?=.* " + key.replace(' '," )(?=.* ") + " ).*")
        if (re.test(` ${string} `)){
            say(map.get(key),string)
            return
        }
    }
    say("I'm sorry but I am having trouble understanding please rephrase")
}

const map = new Map([
    ["how you","I am well today, How are you?"],
    ["great"," "],
    ["well"," "],
    ["nice"," "],
    ["good"," "],
    ["why sky blue","It is just blue"],
    ["can have cookie","I am sorry but i have no cookies"],
    ["what happens if divide by zero","the world explodes"],
    ["play bee movie","According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible."],
    ["carrot","a carrot is a carrot and a carrot is a carrot"],
    ["did you ever hear tragedy of darth plagueis wise","no"],
    ["thought not it's not story jedi would tell it's sith legend darth plagueis was dark lord of sith so powerful and so wise he could use force to influence midi-chlorians to create life he had such knowledge of dark side he could even keep ones he cared about from dying","he could actually save people from death"],
    ["dark side of force pathway to many abilities some consider to be unnatural","what happened to him"],
    ["he became so powerful that only thing he was afraid of was losing his power which eventually of course he did unfortunately he taught his apprentice everything he knew then his apprentice killed him in his sleep ironic he could save others from death but not himself","is it possible to learn this power"],
    ["not from jedi","end scene"],
    ["hi",`Hello I am ${roboName}`],
    ["change your name","NAMECHANGE"]
])