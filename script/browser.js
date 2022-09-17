console.log("New Script");

document.addEventListener("click", function (e) {
  console.log("qqqqqqqqqqqq", e.target.classList.contains("edit-me"));
    if (e.target.classList.contains("edit-me")) {
  console.log("attribute",e.target.getAttribute("data-id"));

  let data = prompt("enter cost");
  axios
    .post("/update-details", {
      text: data,id:e.target.getAttribute("data-id"),
    })
    .then(function () {
    //   console.log("req body", body.type);
    console.log("Sucesss");
 
    })
    .catch(function () {
      console.log("error");
    });

    }
    else  if (e.target.classList.contains("delete-me")) {
        axios
          .post("/delete-details", {
        id:e.target.getAttribute("data-id"),
          })
          .then(function () {
          //   console.log("req body", body.type);
          console.log("Sucesss");
       
          })
          .catch(function () {
            console.log("error");
          });
          }
});
