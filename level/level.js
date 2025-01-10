function locked() {
    alert("Coming soon");
}

function startLevel(level) {
    if (level === 1) {
        window.location.href = 'play.html';
    } else {
        alert("Level not available");
    }
}

// Check if level 2 should be unlocked
if (localStorage.getItem('level2Unlocked') === 'true') {
    document.getElementById('level-2').onclick = () => startLevel(2);
    document.getElementById('level-2').innerHTML = `<i class="fas fa-gamepad"></i> 2`;
}