export default class Likes
{
    constructor()
    {
        this.likes = [];
    }
    addLike(id,title,author,img)
    {
        const like = {id,title,author,img};
        this.likes.push(like);
        return like;
    }

    deleteLike(id)
    {
        const index = this.likes.findIndex(el=> el.id ===id);
        this.likes.splice(index,1);
    }

    isliked(id)
    {
        
        const ans = this.likes.findIndex(el => el.id===id) !==-1;
        return ans;
    }

    getNumLikes()
    {
        return this.likes.length;
    }
}