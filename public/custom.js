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
        $.ajax({
            type: 'post',
            url: '/user/like',
            data: { postid: like, shouldDislike }
        }).done(function (data) {
            // Optionally alert the user of success here...
            console.log(data);
            if (data && data._id) {
                //let $likeHeartButton = $(".like-heart-button");
                let $likeHeartButton = $(this).children(".like-heart-button");
                $($likeHeartButton).toggleClass("fa-heart")
                $($likeHeartButton).toggleClass("fa-heart-o")
                // if (shouldDislike) {
                //     $(this).html(`<i class="fa fa-heart-o like-heart-button"
                //     aria-hidden="true"></i>`);
                // } else {
                //     $(this).html(`<i class="fa fa-heart like-heart-button"
                //     aria-hidden="true"></i>`);
                // }
                $(this).toggleClass("isLiked")
            }

        }).fail(function (data) {
            // Optionally alert the user of an error here...
        });
    });


});