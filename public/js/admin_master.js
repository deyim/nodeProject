function changeInputValue(value) {
    document.getElementById("changedInput").name = value
}

function chooseAll() {
    checkboxes = document.getElementsByName('checked');
    for(i=0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
}