let mediaRecorder;
let audioChunks = [];

const recordButton = document.getElementById("recordButton");
const audioPlayback = document.getElementById("audioPlayback");
const voiceNoteData = document.getElementById("voiceNoteData");

recordButton.addEventListener("mousedown", startRecording);
recordButton.addEventListener("mouseup", stopRecording);

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;

        // Convert to Base64 to store in hidden input
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            voiceNoteData.value = reader.result;
        };
    };

    mediaRecorder.start();
    recordButton.innerText = "🎙️ Recording...";
    recordButton.style.background = "#ff4d4d";
}

function stopRecording() {
    mediaRecorder.stop();
    recordButton.innerText = "🎙️ Hold to Record";
    recordButton.style.background = "#28a745";
}
