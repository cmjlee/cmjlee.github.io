// TODO: change the lists below to update options for Resident/Staff/Anesthesia etc...
const residentList = ["Apple", "Orange"];
const staffList = ["Melon", "Grape"];
const anesthesiaList = ["Berry", "Mango"];
const procedureList = [1, 16, 17, 32];
const complicationList = ["none", "IAN exposure", "Sinus exposure"];

const dropdownIds = {"resident": residentList, "staff": staffList, 
                    "anesthesia": anesthesiaList, "procedure": procedureList,
                    "complication": complicationList};

function addOptions(){
    for(var id in dropdownIds){
        let datalist = document.getElementById(`${id}List`);
        let options = dropdownIds[id];
        options.forEach(el => {
            let option = document.createElement("option");
            option.value = el;
            datalist.appendChild(option);
        });
    }
}

function briefOperationSummary(){
    // date, time
    let date = $("#date").val();
    let time = $("#time").val();
    let preOpDiag = $("#preOpDiagnosis").val();
    let postOpDiag = $("#postOpDiagnosis").val();
    let resident = $('#resident').val();
    let staff = $('#staff').val();
    let anesthesia = $('#anesthesia').val();
    let procedure = $('#procedure').val();
    let ivf = $('#ivf').val();
    let bloodLoss = $('#bloodLoss').val();
    let urine = $('#urine').val();
    let drains = $('#drain').val();
    let specimen = $('#specimen').val();
    let complications = $('#complication').val();


    // outline of summary
    // TODO: change the partialSummary variable below to change the outline
    // (this is assuming that all fields under brief operation note extraction are filled in)
    let partialSummary = `${resident} and ${staff} performed operation on ${date} at ${time}. The pre-op diagnosis is ${preOpDiag} and the post-op diagnosis is ${postOpDiag}. The anesthesia used was ${anesthesia} using procedure ${procedure}. The IVF was ${ivf}. Blood loss was ${bloodLoss}.`;


    // for sentence output that change based on the form input, you may choose the format the sentence as needed using the
    // following structure

    if(urine === "none"){ 
        partialSummary += " There was no urine output."; 
        //update the partialSummary with the correct sentence format. This adds the sentence to the end of the summary.
        // Note: Make sure there is a space in the beginning.
    }else{
        partialSummary += ` The urine output is ${urine}.`;
    }

    if(drains === "none"){
        partialSummary += " There were no drains.";
    }else{
        partialSummary += ` Drains were ${drains}.`;
    }

    if(specimen === "none"){
        partialSummary += " There were no specimens.";
    }else{
        partialSummary += ` Specimens were ${specimen}.`;
    }

    if(complications === "none"){
        partialSummary += " There were no complications.";
    }else{
        partialSummary += ` Complications were ${complications}.`;
    }

    return partialSummary;
}


// return summary of prescription + other prescriptions + whether post-op instructions have been reviewed
// FU + special instructions
function getRxSummary() {

    let medicationId = ["ibuprofen", "peridex", "norco", "tylenol500", "tylenol325"];
    let nameDict = {"ibuprofen": "Ibuprofen", "peridex":"peridex (swish and spit 15ml bid)","tylenol500": "Tylenol 500mg 2 tabs po q8h", 
    "tylenol325": "Tylenol 325mg 2 tabs po q6h"}
    let summary = "";
    medicationId.forEach((id) => {
        let input = document.getElementById(id);
        if(input.checked){
            console.log(id+"Amt");
            let amt;
            if(id === "peridex"){
                if(document.getElementById("oneBtl").checked){
                    amt = "1 btl";
                }else if(document.getElementById("twoBtl").checked){
                    amt = "2 btls";
                }
            }else{
                amt = document.getElementById(id+"Amt").value;
            }
            if(id === "ibuprofen"){
                // find amt checked;
                let mg = ["400", "600", "800"];
                let checkedmg = "";
                mg.forEach((num) =>{
                    if(document.getElementById(`ibuprofen${num}`).checked){
                        checkedmg = num;
                    }
                });

                summary += `, ${amt} of ${nameDict[id]} ${checkedmg} mg po q8h`;
            }else{
                summary += `, ${amt} of ${nameDict[id]}`
            }
        }
    });

    // oxycodone
    if(document.getElementById("oxycodone").checked){
        // # of bottles
        let tabs = document.getElementById("oneTabOxycodone".checked)? "1 tab" : "2 tabs";
        let amt = document.getElementById("oxycodoneAmt").value;
        summary += `, ${amt} of Oxycodone 5mg ${tabs} po q4h prn pain,`;
    }
    
    let prescriptionCount = summary.match(/,/g) || [];
    prescriptionCount = prescriptionCount.length;
    if(prescriptionCount > 0){
        let trimmed = summary.replace(/(^,)|(,$)/g, "");
        if(prescriptionCount == 1){
            summary =  trimmed + " has been prescribed."
        }else{
            summary =  trimmed + " have been prescribed."
        }
    }else{
        summary = ""; // no prescriptions selected
    }

    // check other prescriptions
    let others = $("#rxOther").val();
    if(others.length > 0){
        summary += " "+others;
    }

    // post-op instructions + F/U
    let postOpReviewed = $("#postopInstructions").is(':checked');
    let FU = $("#fu").val();

    if(postOpReviewed){
        summary += " Post-op instructions have been reviewed with escort/patient."
    }else{
        summary += " Post-op instructions have not been reviewed with escort/patient."
    }

    if(FU.length > 0){
        summary += ` FU is ${FU}.`;
    }

    let specialInstructions = $('#specialInstructions').val();
    if(specialInstructions.length > 0){
        summary += specialInstructions;
    }

    return summary;
}

function operationDescSummary() {

    //Question: not sure of the format for the y/n section right below the "Description of Operation" heading

    let partialSummary = "";

    // you can check whether the options were selected yes/no
    let rbaYes = $('#rbaYes').is(':checked');
    let consentYes = $('#consentYes').is(':checked');
    let monitorsYes = $('#monitorsYes').is(':checked');
    let o2Yes = $('#o2Yes').is(':checked');
    let ivYes = $('#ivYes').is(':checked');
    let seeIVSedationChecked = $('#seeIVSedationCheck').is(':checked');

    // example of how to choose which sentence to add based on selected values
    if(rbaYes){ //if yes is selected for RBA
        partialSummary += " RBA has been discussed and understood.";
    }else{ //if no is selected for RBA
        partialSummary += " RBA has not been discussed and understood.";
    }

    if(consentYes){ //if yes is selected for RBA
        partialSummary += " Consent has been signed.";
    }else{ //if no is selected for RBA
        partialSummary += " Consent has not been signed.";
    }

    if(monitorsYes){
        //TODO: not sure the format for this one (likewise for O2 and IV)
    }

    if(seeIVSedationChecked){
        partialSummary = " Please see IV sedation form for vitals.";
    }

    let vitalsSummary = ""; // this is summary *only* for vitals
    let vitalsIds = ["vitalsPre", "vitlasPost"];
    vitalsIds.forEach((id) => {
        let vitalType = id.toLowerCase().endsWith("pre") ? "Pre" : "Post";

        let vitalTypeSummary = `${vitalType} op vitals are as follows:`;
        let vitalList = ["HR", "RR", "SaO2", "BP"];
        
        vitalList.forEach((elName) => {
            let elId = vitalType.toLowerCase()+"Op"+elName;
            let el = document.getElementById(elId);
            
            if(el !== null && el.value !== ""){
                vitalTypeSummary += ` ${elName}: ${el.value}`;
                if(elName === "SaO2"){
                    vitalTypeSummary += "%";
                }
                vitalTypeSummary += ",";
            }
        });

        // remove trailing ','
        let trimmed = vitalTypeSummary.replace(/(^,)|(,$)/g, "");
        if(!vitalTypeSummary.endsWith(":")){
            vitalsSummary += " "+trimmed + ".";
        }
    });

    // TODO: what should the format for the "Local: " section be?

    // TODO: and for procedure?
    let procedureIds = {"timeout": "timeout", "throatScreen": "throat screen", "jawStabilized": "jaw stabilized for TMJ prophy"};
    let procedureList = "";
    for(let id in procedureIds){
        let checked = $(`#${id}`).is(':checked');
        if(checked){
            procedureList += ` ${procedureIds[id]},`;
        }
    }

    let numChecked = procedureList.match(/,/g) || [];
    numChecked = numChecked.length;

    let procedureCheckedSummary = "";
    if(numChecked > 0){
        let trimmed = procedureList.replace(/(^,)|(,$)/g, "");
        //change sentence format based on pluraity of trimmed
        if(numChecked === 1){
            procedureCheckedSummary += `${trimmed} was used as part of the procedure.`;
        }else{
            procedureCheckedSummary += "The following were used as part of the procedure:" + trimmed + ".";
        }
    }

    let procedureNumIds = ['details1', 'details2', 'details3', 'details4'];
    let allProcedureSummary = "";
    procedureNumIds.forEach((id)=> {
        // iterate through each procedure number
        let container = document.getElementById(id);
        
        let inputs = [...container.getElementsByTagName('input')];
        
        // check if there's anything checked in the first
        if(inputs.length > 0){
            let procedureNumInput = inputs[0];
            if(procedureNumInput.id.startsWith(id) && procedureNumInput.value !== ""){
                let procedureName = procedureNumInput.value;
                let procedureSummary = `For procedure ${procedureName}, the following were used:`;
                inputs.forEach((input) => {
                    if(input.type === "checkbox" && input.checked){
                        // get the correct and full name of the checked checkd
                        let labelName = input.nextElementSibling.innerText;
                        procedureSummary += ` ${labelName},`;
                    }
                });

                //trim if necessary
                let trimmed = procedureSummary.replace(/(^,)|(,$)/g, "");
                allProcedureSummary += trimmed +". ";
            }
        }  
    });


    // Notes
    let notes = $('#notes').val();

    // the checkboxes above RX:
    let additionalSummary = "";
    let inputIds = ["throatScreenRemoved", "hemostasis", "oralGauze", "imaging"];
    let checkedCount = 0;
    let checkedItems = "";
    inputIds.forEach((id) => {
        let input = document.getElementById(id);
        if(input.checked){
            checkedCount += 1;
            let labelName = input.nextElementSibling.innerText;
            labelName = labelName.toLowerCase();
            checkedItems += `, ${labelName}`;
        }
    });
    if(checkedCount > 0){
        checkedItems = checkedItems.replace(/(^,)|(,$)/g, "");
        if(checkedCount === 1){
            additionalSummary = `The following has been done as well as part of the procedure:${checkedItems}.`;
        }else{
            additionalSummary = `The following have been done as well as part of the procedure:${checkedItems}.`;
        }
    }
    let imagingReviewer = $('#initials').val();
    if(imagingReviewer.length > 0){
        additionalSummary += ` Images were reviewed by ${imagingReviewer}.`;
    }

    // RX: medical prescription
    let rxSummary = getRxSummary();

    // patient information
    let patientInfo = $("#patientInfo").val();
    if(patientInfo.length > 0){
        patientInfo = "Patient information is as follows: "+patientInfo;
    }

    let allSummaries = [vitalsSummary, procedureCheckedSummary, allProcedureSummary, notes, additionalSummary, rxSummary, patientInfo];
    allSummaries.forEach((s) => {
        if(s.length > 0){
            partialSummary += " " + s;
        }
    });
    return partialSummary;
}


function generateSummary(){
    console.log("generating summary...");

    let briefOpSummary = briefOperationSummary();
    let operationDescriptionSummary = operationDescSummary();
    let summary = briefOpSummary + " " + operationDescriptionSummary;
    
    // update summary text box with generated summary
    $('#summary').val(summary);
    $('#summary').focus();
    return summary;
}

window.onload = function(){
    // setup();

    $(document).ready(function() {
        // options for operation date
        $('#datetimepicker4').datetimepicker({
            defaultDate: moment(),
            format: 'L'
        });

        // options for operation time
        $('#datetimepicker3').datetimepicker({
            defaultDate: moment(),
            format: 'LT'
        });
        addOptions();

        document.getElementById("generateBtn").addEventListener("click",generateSummary);

        // $('#form').submit(function(event){
        //     // e.preventDefault();
        //     generateSummary();
        //     event.preventDefault();
        //     return false; //prevent form from reloading
        // });
    });
}