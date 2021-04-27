let speechRecognition = window.webkitSpeechRecognition
let recognition = new speechRecognition()
let msg = new SpeechSynthesisUtterance()
let voices = window.speechSynthesis.getVoices()
let textbox = $("#textbox")
let textbox2 = $("#textbox2")
let instructions = $("#instructions")
let roboName = "RoboBuddy"
recognition.continuous = true

recognition.onstart = function () {
    instructions.text("Voice recognition is on")
}

recognition.onspeechend = function () {
    instructions.text("No Activity")
    recognition.start()
}

recognition.addEventListener('end', recognition.start)

recognition.onerror = function () {
    instructions.text("Error")
}

recognition.onresult = function (event) {
    let current = event.resultIndex
    let message = event.results[current][0].transcript
    
    textbox2.val("")
    textbox.val(message)
    message = simplify(message)
    
    conversation(message)
}

$("#start-btn").click(function (event) {
    recognition.start()
})

function conversation(message){
    if (message.startsWith("can you change your name to ")){
        roboName = message.substring(28)
        say(`Ok I am now ${roboName}`)
        map.set("hi",`Hello I am ${roboName}`)
        return
    }
    checkAllInputs(message)
    //testForMessage(message)
}

function remove(string, stringSplit, i){
    let newString = string.replace(stringSplit[i],'')
    newString = newString.trim()
    newString = newString.replace(/\s\s+/g, ' ') 
    return newString
}

function simplify(message){
    let mapObj = {hello:"hi",hey:"hi",greetings:"hi",is:'',i:'',the:'',a:'',of:'',are:''}
    let re = new RegExp("\\b(?:" + Object.keys(mapObj).join("|") + ")\\b","gi")
    message = message.replace(re, function(matched){
        return mapObj[matched.toLowerCase()]
    })
    message = message.replace(/\s\s+/g,' ').trim().toLowerCase()
    return message
}

function say(result){
    textbox2.val(result)
    let voices = window.speechSynthesis.getVoices()
    //msg.voice = voices[3]
    msg.lang = 'en-UK'
    msg.rate = .9
    msg.pitch = 1
    msg.text = result
    speechSynthesis.speak(msg)
}

function checkAllInputs(string){
    let keys = Array.from(map.keys())
    for (let i = 0; i < keys.length; i++){
        let re = new RegExp("(?=.* " + keys[i].replace(' '," )(?=.* ") + " ).*")
        if (re.test(` ${string} `)){
            say(map.get(keys[i]))
            return
        }
    }
    say("I'm sorry but I am having trouble understanding please rephrase")
}

let map = new Map([
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
    ["hi",`Hello I am ${roboName}`]
])