/**
 * Main post class
 */
"use strict";
/* global Swiper, CommentsPaginator, PostsPaginator  */
/* global app */
/* global updateButtonState, redirect, trans, trans_choice, launchToast */
/* global  mswpScanPage, showDialog, hideDialog, filterXSS, initTooltips, bindNoLongPressEvents  */


var Post = {

    draftData:{
        text: "",
        attachments:[]
    },

    activePage: 'post',
    postID: null,
    commentID: null,
    scrollToPostWhenTogglingDescription: true,

    /**
     * Sets the current active page
     * @param page
     */
    setActivePage: function(page){
        Post.activePage = page;
    },

    /**
     * Instantiates the media module for post(s)
     * @returns {*}
     */
    initPostsMediaModule: function () {
        return new Swiper(".post-box .mySwiper", {
            // slidesPerColumn:1,
            slidesPerView:'auto',
            pagination: {
                el: ".swiper-pagination",
                // type: "fraction",
                dynamicBullets: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    },

    /**
     * Initiates the gallery swiper module
     * @param gallerySelector
     */
    initGalleryModule: function (gallerySelector = false) {
        mswpScanPage(gallerySelector,'mswp');
    },

    /**
     * Method used for adding a new post comment
     * @param postID
     */
    addComment: function (postID) {
        let postElement = $('*[data-postID="'+postID+'"]');
        let newCommentButton = postElement.find('.new-post-comment-area').find('button');
        updateButtonState('loading',newCommentButton);
        $.ajax({
            type: 'POST',
            data: {
                'message': postElement.find('.new-comment-textarea').val(),
                'post_id': postID
            },
            url: app.baseUrl+'/posts/comments/add',
            success: function (result) {
                if(result.success){
                    launchToast('success',trans('Success'),trans('Comment added'));
                    postElement.find('.no-comments-label').addClass('d-none');
                    postElement.find('.post-comments-wrapper').prepend(result.data).fadeIn('slow');
                    postElement.find('.new-comment-textarea').val('');
                    const commentsCount = parseInt(postElement.find('.post-comments-label-count').html()) + 1;
                    postElement.find('.post-comments-label-count').html(commentsCount);
                    postElement.find('.post-comments-label').html(trans_choice('comments',commentsCount));
                    updateButtonState('loaded',newCommentButton);
                }
                else{
                    launchToast('danger',trans('Error'),result.errors[0]);
                    updateButtonState('loaded',newCommentButton);
                }
                newCommentButton.blur();
            },
            error: function (result) {
                postElement.find('.new-comment-textarea').addClass('is-invalid');
                if(result.status === 422) {
                    $.each(result.responseJSON.errors,function (field,error) {
                        if(field === 'message'){
                            postElement.find('.new-comment-textarea').parent().find('.invalid-feedback').html(error);
                        }
                    });
                    updateButtonState('loaded',newCommentButton);
                }
                else if(result.status === 403 || result.status === 404){
                    launchToast('danger',trans('Error'), result.responseJSON.message);
                }
                newCommentButton.blur();
            }
        });
    },

    /**
     * Shows up post comment delete dialog confirmation dialog
     * @param postID
     * @param commentID
     */
    showDeleteCommentDialog: function(postID, commentID){
        showDialog('comment-delete-dialog');
        Post.commentID = commentID;
        Post.postID = postID;
    },

    /**
     * Deletes post comment
     */
    deleteComment: function(){
        let commentElement = $('*[data-commentID="'+Post.commentID+'"]');
        let postElement = $('*[data-postID="'+Post.postID+'"]');
        $.ajax({
            type: 'DELETE',
            data: {
                'id': Post.commentID
            },
            dataType: 'json',
            url: app.baseUrl+'/posts/comments/delete',
            success: function (result) {
                if(result.success){
                    commentElement.fadeOut("normal", function() {
                        $(this).remove();
                        if(postElement.find('.post-comment').length === 0){
                            postElement.find('.no-comments-label').removeClass('d-none');
                        }

                    });

                    const commentsCount = parseInt(postElement.find('.post-comments-label-count').html()) - 1;
                    postElement.find('.post-comments-label-count').html(commentsCount);
                    postElement.find('.post-comments-label').html(trans_choice('comments',commentsCount));

                    launchToast('success',trans('Success'),result.message);
                    hideDialog('comment-delete-dialog');
                }
                else{

                    launchToast('danger',trans('Error'),result.errors[0]);
                    $('#comment-delete-dialog').modal('hide');
                }
            },
            error: function (result) {
                launchToast('danger',trans('Error'),result.responseJSON.message);
                hideDialog('comment-delete-dialog');
            }
        });

    },

    /**
     * Toggle post comment area visibility
     * @param post_id
     */
    showPostComments: function(post_id){
        let postElement = $('*[data-postID="'+post_id+'"] .post-comments');

        // No pagination needed - on feed
        if(typeof postVars === 'undefined'){
            CommentsPaginator.nextPageUrl = '';
        }

        if(CommentsPaginator.nextPageUrl === ''){
            CommentsPaginator.init(app.baseUrl+'/posts/comments',postElement.find('.post-comments-wrapper'));
        }

        const isHidden = postElement.hasClass('d-none');
        if(isHidden){
            if(!postElement.hasClass('latest-comments-loaded')){
                CommentsPaginator.loadResults(post_id,9);
            }
            postElement.removeClass('d-none');
            postElement.addClass('latest-comments-loaded');
        }
        else{
            postElement.addClass('d-none');
        }
    },

    /**
     * Add new reaction
     * Can be used for post or comment reactionn
     * @param type
     * @param id
     */
    reactTo: function (type,id) {
        let reactElement = null;
        let reactionsCountLabel = null;
        let reactionsLabel = null;
        if(type === 'post'){
            reactElement = $('*[data-postID="'+id+'"] .post-footer .react-button');
            reactionsCountLabel = $('*[data-postID="'+id+'"] .post-footer .post-reactions-label-count');
            reactionsLabel = $('*[data-postID="'+id+'"] .post-footer .post-reactions-label');
        }
        else{
            reactElement = $('*[data-commentID="'+id+'"] .react-button');
            reactionsCountLabel = $('*[data-commentID="'+id+'"] .comment-reactions-label-count');
            reactionsLabel = $('*[data-commentID="'+id+'"] .comment-reactions-label');
        }
        const didReact = reactElement.hasClass('active');
        if(didReact){
            reactElement.removeClass('active');
            reactElement.html(`<ion-icon name="heart-outline" class="icon-medium"></ion-icon>`);
        }
        else{
            reactElement.addClass('active');
            reactElement.html(`<ion-icon name="heart" class="icon-medium text-primary"></ion-icon>`);
        }
        $.ajax({
            type: 'POST',
            data: {
                'type': type,
                'action': (didReact === true ? 'remove' : 'add'),
                'id': id
            },
            dataType: 'json',
            url: app.baseUrl+'/posts/reaction',
            success: function (result) {
                if(result.success){
                    let count = parseInt(reactionsCountLabel.html());
                    if(didReact){
                        count--;
                    }
                    else{
                        count++;
                    }
                    reactionsCountLabel.html(count);
                    reactionsLabel.html(trans_choice('likes',count));
                    // launchToast('success',trans('Success'),result.message);
                }
                else{
                    launchToast('danger',trans('Error'),result.errors[0]);
                }
            },
            error: function (result) {
                launchToast('danger',trans('Error'),result.responseJSON.message);
            }
        });
    },

    /**
     * Appends replied username to comment field
     * @param username
     */
    addReplyUser: function(username){
        $('.new-post-comment-area textarea').val($('.new-post-comment-area textarea').val()+ ' @' +username+ ' ');
    },

    /**
     * Shows up the post removal confirmation box
     * @param post_id
     */
    confirmPostRemoval: function (post_id) {
        Post.postID = post_id;
        $('#post-delete-dialog').modal('show');
    },

    /**
     * Removes user post
     */
    removePost: function(){
        let postElement = $('*[data-postID="'+Post.postID+'"]');
        $.ajax({
            type: 'DELETE',
            data: {
                'id': Post.postID
            },
            dataType: 'json',
            url: app.baseUrl+'/posts/delete',
            success: function (result) {
                if(result.success){
                    if(Post.activePage !== 'post'){
                        $('#post-delete-dialog').modal('hide');
                        postElement.fadeOut("normal", function() {
                            $(this).remove();
                        });
                    }
                    else{
                        if(document.referrer.indexOf('feed') > 0){
                            redirect(app.baseUrl + '/feed');
                        }
                        else{
                            redirect(document.referrer);
                        }
                    }
                    launchToast('success',trans('Success'),result.message);

                }
                else{
                    $('#post-delete-dialog').modal('hide');
                    launchToast('danger',trans('Error'),result.errors[0]);
                }
            },
            error: function (result) {
                launchToast('danger',trans('Error'),result.responseJSON.message);
            }
        });
    },

    /**
     * Adds or removes user bookmarks
     * @param id
     */
    togglePostBookmark: function (id) {
        let reactElement = $('*[data-postID="'+id+'"] .bookmark-button');
        const isBookmarked = reactElement.hasClass('is-active');
        $.ajax({
            type: 'POST',
            data: {
                'action': (isBookmarked === true ? 'remove' : 'add'),
                'id': id
            },
            dataType: 'json',
            url: app.baseUrl+'/posts/bookmark',
            success: function (result) {
                if(result.success){
                    if(isBookmarked){
                        reactElement.removeClass('is-active');
                        reactElement.html(trans('Bookmark this post'));
                    }
                    else{
                        reactElement.addClass('is-active');
                        reactElement.html(trans('Remove this bookmark'));
                    }

                    launchToast('success',trans('Success'),result.message);
                }
                else{
                    launchToast('danger',trans('Error'),result.errors[0]);
                }
            },
            error: function (result) {
                launchToast('danger',trans('Error'),result.responseJSON.message);
            }
        });
    },

    /**
     * Function used to pin/unpin a post
     * @param id
     */
    togglePostPin: function (id) {
        let reactElement = $('*[data-postID="'+id+'"] .pin-button');
        const isPinned = reactElement.hasClass('is-active');
        $('.pinned-post-label').addClass('d-none');
        $.ajax({
            type: 'POST',
            data: {
                'action': (isPinned === true ? 'remove' : 'add'),
                'id': id
            },
            dataType: 'json',
            url: app.baseUrl+'/posts/pin',
            success: function (result) {
                if(result.success){
                    if(isPinned){
                        $('*[data-postID="'+id+'"] .pinned-post-label').addClass('d-none');
                        reactElement.removeClass('is-active');
                        reactElement.html(trans('Pin this post'));
                    }
                    else{
                        $('*[data-postID="'+id+'"] .pinned-post-label').removeClass('d-none');
                        reactElement.addClass('is-active');
                        reactElement.html(trans('Un-pin post'));
                    }

                    launchToast('success',trans('Success'),result.message);
                }
                else{
                    launchToast('danger',trans('Error'),result.errors[0]);
                }
            },
            error: function (result) {
                launchToast('danger',trans('Error'),result.responseJSON.message);
            }
        });
    },

    /**
     * Disabling right for posts ( if site wise setting is set to do it )
     */
    disablePostsRightClick: function () {
        $(".post-media, .pswp__item").unbind('contextmenu');
        $(".post-media, .pswp__item").on("contextmenu",function(){
            return false;
        });
        bindNoLongPressEvents();
    },

    /**
     * Toggles post's full/short description
     */
    toggleFullDescription:function (postID) {
        let postElement = $('*[data-postID="'+postID+'"]');
        $('*[data-postID="'+postID+'"] .label-less, *[data-postID="'+postID+'"] .label-more').addClass('d-none');
        if(postElement.find('.post-content-data').hasClass('line-clamp-3')){
            postElement.find('.post-content-data').removeClass('line-clamp-3');
            postElement.find('.label-less').removeClass('d-none');
        }
        else{
            postElement.find('.post-content-data').addClass('line-clamp-3');
            postElement.find('.label-more').removeClass('d-none');
        }
        if(Post.scrollToPostWhenTogglingDescription){
            PostsPaginator.scrollToLastPost(postID);
        }
    },

    showEditCommentInterface: function (postID, commentID){
        Post.cancelEditCommentInterface();
        let commentElement = $('*[data-commentID="'+commentID+'"]');
        commentElement.find('.post-comment-content').addClass('d-none');
        commentElement.find('.post-comment-edit').removeClass('d-none');
    },

    cancelEditCommentInterface: function (){
        $('.post-comment').each(function(key,element) {
            $(element).find('.post-comment-content').removeClass('d-none');
            $(element).find('.post-comment-edit').addClass('d-none');
            let commentElement = $(element);
            commentElement.find('.edit-comment-textarea').removeClass('is-invalid');
            let commentContent = commentElement.find('.comment-content').html();
            commentContent = filterXSS(commentContent);
            commentElement.find('textarea').val(commentContent);
        });
    },

    saveEditedComment: function (postID, commentID){
        let commentElement = $('*[data-commentID="'+commentID+'"]');
        let newCommentButton = commentElement.find('.post-comment-edit').find('button');
        let commentContent = commentElement.find('textarea').val();
        updateButtonState('loading',newCommentButton);
        $.ajax({
            type: 'POST',
            data: {
                'message': commentContent,
                'post_id': postID,
                'comment_id': commentID
            },
            url: app.baseUrl+'/posts/comments/edit',
            success: function (result) {
                if(result.success){
                    launchToast('success',trans('Success'),trans('Comment saved'));
                    commentContent = filterXSS(commentContent);
                    commentElement.find('textarea').val(commentContent);
                    commentElement.find('.comment-content').html(commentContent);
                    Post.cancelEditCommentInterface();
                    initTooltips();
                    updateButtonState('loaded',newCommentButton);
                }
                else{
                    launchToast('danger',trans('Error'),result.errors[0]);
                    updateButtonState('loaded',newCommentButton);
                }
                newCommentButton.blur();
            },
            error: function (result) {
                commentElement.find('textarea').addClass('is-invalid');
                if(result.status === 422) {
                    $.each(result.responseJSON.errors,function (field,error) {
                        if(field === 'message'){
                            commentElement.find('textarea').parent().find('.invalid-feedback').html(error);
                        }
                    });
                    updateButtonState('loaded',newCommentButton);
                }
                else if(result.status === 403 || result.status === 404){
                    launchToast('danger',trans('Error'), result.responseJSON.message);
                }
                newCommentButton.blur();
            }
        });
    },

};

