//Creates a speech recognition object.
const speechRecognition = window.webkitSpeechRecognition
const recognition = new speechRecognition()
//Assigns variables to html elements.
const textbox = $("#textbox")
const textbox2 = $("#textbox2")
const instructions = $("#instructions")
const startBtn = $("#start-btn")
//Defines name of RoboBuddy and creates notSpeaking Variable which allows the code to tell if RoboBuddy is speaking and if its listening.
let roboName = "RoboBuddy"
let notSpeaking = true
let recognitionOn = true
//Creates parameters for different events with Responsive Voice.
const parameters = {
    onend: voiceEndCallback
}
//Sets speech recognition to be continuous so a conversation can be held.
recognition.continuous = true
//Let's browser user know that voice recognition is on.
recognition.onstart = () => instructions.text("Voice recognition is on")
//Ensures that it will continue to listen for speach unless it is playing audio.
recognition.addEventListener('end', () => {if (notSpeaking) recognition.start()})
//Informs browser user of error.
recognition.onerror = () => instructions.val("error")
//Runs code whenever speach is recognized.
recognition.onresult = (event) => {
    //Gets message as a string and updates the textboxes for browser users.
    let current = event.resultIndex
    let message = event.results[current][0].transcript
    textbox2.val("")
    textbox.val(message)
    //simplifies the message.
    message = simplify(message)
    //Compares the message to the map of inputs and outputs and gives the correct response.
    checkAllInputs(message, map)
}

startBtn.click( () => {
    if (recognitionOn && notSpeaking) {
        notSpeaking = false
        recognition.stop()
        startBtn.text("Start")
        instructions.text("Press the Start Button")
        recognitionOn = false
        return
    }
    recognition.start()
    startBtn.text("Stop")
    notSpeaking = true
    recognitionOn = true
})

function simplify(message){
    //replaces words in message
    let mapObj = {hello:"hi",hey:"hi",greetings:"hi"}
    let re = new RegExp("\\b(?:" + Object.keys(mapObj).join("|") + ")\\b","gi")
    message = message.replace(re, (matched) => mapObj[matched.toLowerCase()])
    //formats message correctly
    message = message.replace(/\s\s+/g,' ').trim().toLowerCase()
    return message
}

function checkAllInputs(string, map){
    //gives the say function the maps output as well as the users message.
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

function say(result, string){
    //Speaks the correct output and changes the names if given the correct message.
    textbox2.val(result)
    let msg = result
    if (result === "NAMECHANGE"){
        roboName = string.split(" ").pop().charAt(0).toUpperCase() + string.split(' ').pop().slice(1)
        textbox2.val(`Ok I am now ${roboName}`)
        msg = `Ok I am now ${roboName}`
        map.set("hi",`Hello I am ${roboName}`)
        document.getElementsByClassName("text-center mt-5")[0].innerHTML = `${roboName}`
    }
    responsiveVoice.speak(msg, "UK English Female", parameters)
    //Stops listening to user until it finishes speaking.
    notSpeaking = false
    recognition.stop()
}

function voiceEndCallback() {
    notSpeaking = true
    recognition.start()
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
    ["did you ever hear the tragedy of darth plagueis the wise","no"],
    ["thought not it's not story jedi would tell it's sith legend darth plagueis was dark lord of sith so powerful and so wise he could use force to influence midi-chlorians to create life he had such knowledge of dark side he could even keep ones he cared about from dying","he could actually save people from death"],
    ["dark side of force pathway to many abilities some consider to be unnatural","what happened to him"],
    ["he became so powerful that only thing he was afraid of was losing his power which eventually of course he did unfortunately he taught his apprentice everything he knew then his apprentice killed him in his sleep ironic he could save others from death but not himself","is it possible to learn this power"],
    ["not from jedi","end scene"],
    ["hi",`Hello I am ${roboName}`],
    ["change your name","NAMECHANGE"]
])

recognition.start()