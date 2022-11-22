pragma solidity ^0.4.17;

contract pateronFactory{
    address[] public registeredArtists;
    mapping(string=>address) uniqueIdtoAddress;
    uint public artistCount;

    function createArtist(string name,uint minContrib, string uid, string youtube, string twitch, string category,string purl) public{
        address newArtist = new Artist(name, minContrib,msg.sender, uid, youtube, twitch, category, purl);
        registeredArtists.push(newArtist);
        uniqueIdtoAddress[uid]=newArtist;
        artistCount++;
    }

    function getArtistByID(string uid) public view returns(address){
        return uniqueIdtoAddress[uid];
    }

    function getArtist() public view returns(address[]){
        return registeredArtists;
    }

}

contract Artist{
    string public name;
    string public uniqueid;
    mapping(address=>bool) public subscribedUsers;
    string public youtube;
    string public twitch;
    uint public minContri;
    Post[] public posts;
    string public cate;
    address public manager;
    mapping(uint=>string) profileDP;

    struct Post{
        string title;
        string content;
        string doctype;
        string docurl;
        string dochash;
    }

    modifier restricted(){
        require(msg.sender==manager);
        _;
    }

    function getPostsLength() public view returns(uint){
        return posts.length;
    }

    function Artist(string Aname,uint minContrib,address Amanager, string uid, string Ayoutube, string Atwitch, string Acategory,string profileurl) public{
        name=Aname;
        uniqueid=uid;
        youtube=Ayoutube;
        twitch=Atwitch;
        minContri=minContrib;
        manager=Amanager;
        cate=Acategory;
        profileDP[0]=profileurl;
    }

    function registerUser() public payable{
        require(msg.value>minContri);
        subscribedUsers[msg.sender]=true;
    }

    function postABlog(string ptitle, string pcontent, string pdoctype, string pdocurl, string pdochash) public restricted{
        Post memory newPost = Post({
            title: ptitle,
            content: pcontent,
            doctype:pdoctype,
            docurl:pdocurl,
            dochash:pdochash
        });

        posts.push(newPost);
    }

    function getMoney() public restricted{
        manager.transfer(this.balance);
    }

    function getArtistDetails() public view returns(string, string, string, string, uint, string, uint,string){
        return (
            name,
            uniqueid,
            youtube,
            twitch,
            minContri,
            cate,
            posts.length,
            profileDP[0]
        );
    }
}
