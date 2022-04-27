$(document).ready(function () {

    let $sendForm = $(".send-form");

    $sendForm.submit(function (event) {
        console.log(event)
        event.preventDefault(); // Prevent the form from submitting via the browser
        var form = $(this);
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize()
        }).done(function (data) {
            // Optionally alert the user of success here...
            console.log(data.comment);
            // let commentsDivArr = [];
            // for(var comm of data.comment){
            //     commentsDivArr.push();
            // }
            let comm = data.comment[data.comment.length - 1]
            let newCommentSection = `<div class="each-comment">
                <h6>
                    ${comm.user.username}:<p>
                            ${comm.comment}
                        </p>
                </h6>

            </div>`
            console.log("Section ID :: ", `#comm-${data._id.toString()}`);
            $(`#comm-${data._id.toString()}`).append(newCommentSection);
            $('.comment-box').val('');

        }).fail(function (data) {
            // Optionally alert the user of an error here...
        });
    });

    let $likeButton = $(".like-heart");

    $likeButton.on("click", function (event) {
        event.preventDefault(); // Prevent the form from submitting via the browser

        var like = $(this).attr('value');
        let shouldDislike = $(this).attr('class').includes('isLiked')
        console.log('shouldDislike :: ', shouldDislike);
        let selfEl = $(this)
        $.ajax({
            type: 'post',
            url: '/user/like',
            data: { postid: like, shouldDislike }
        }).done(function (data) {
            // Optionally alert the user of success here...
            console.log(data);
            if (data && data._id) {
                if (shouldDislike) {
                    $(selfEl).html(`<i class="fa fa-heart-o like-heart-button"
                    aria-hidden="true"></i>`);
                } else {
                    $(selfEl).html(`<i class="fa fa-heart like-heart-button"
                    aria-hidden="true"></i>`);
                }
                $(selfEl).toggleClass("isLiked")
            }

        }).fail(function (data) {
            // Optionally alert the user of an error here...
        });
    });

    let $saveButton = $(".save-bookmark");


    $saveButton.on("click", function (event) {
        event.preventDefault(); // Prevent the form from submitting via the browser

        var save = $(this).attr('value');
        let shouldDisSave = $(this).attr('class').includes('isSaved')
        console.log('shouldDisSave :: ', shouldDisSave);
        let selfEl = $(this)
        $.ajax({
            type: 'post',
            url: '/user/save',
            data: { postid: save, shouldDisSave }
        }).done(function (data) {
            // Optionally alert the user of success here...
            console.log(data);
            if (data && data._id) {
                if (shouldDisSave) {
                    $(selfEl).html(`<i class="fa fa-regular fa-bookmark save-bookmark-button"
                    aria-hidden="true"></i>`);
                } else {
                    $(selfEl).html(`<i class="fa fa-solid fa-bookmark save-bookmark-button"
                    aria-hidden="true"></i>`);
                }
                $(selfEl).toggleClass("isSaved")
            }

        }).fail(function (data) {
            // Optionally alert the user of an error here...
        });
    });


});