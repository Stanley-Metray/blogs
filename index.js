class Blog {
    constructor(img, title, description) {
        this.img = img;
        this.title = title;
        this.description = description;
    }
}

let blogs = "";
let toggleEdit = false;
let _id = undefined;

function createBlog() {
    return new Blog(document.getElementById("imgUrl").value,
        document.getElementById("blogTitle").value,
        document.getElementById("description").value
    );
}

document.getElementById("blogForm").addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const blog = createBlog();
        if (!toggleEdit) {
            const res = await axios.post('https://crudcrud.com/api/622d073037c04707a1cb294f2bcc7d1b/blogs', blog, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(res.status, "submit");
            clearInputs();
        }
        else {
            const res = await axios.put(`https://crudcrud.com/api/622d073037c04707a1cb294f2bcc7d1b/blogs/${_id}`, blog)
            setMessage(res.status, "update");
            _id = undefined;
            clearInputs();
        }
    } catch (error) {
        console.log(err);
    }
});

function setMessage(status, type) {
    if (type === "submit") {
        if (status === 201) {
            let msg = document.getElementById('msg');
            msg.innerText = 'Blog Posted';
            setTimeout(() => { msg.innerText = "" }, 3000);
            getPosts();
        }
        else {
            let msg = document.getElementById('msg');
            msg.innerText = 'Something went wrong';
            setTimeout(() => { msg.innerText = "" }, 3000);
        }
    }

    if (type === "update") {
        if (status === 200) {
            let msg = document.getElementById('msg');
            setTimeout(() => { msg.innerText = "" }, 3000);
            msg.innerText = 'Blog Updated';
            document.getElementById('submit').innerText = "Submit";
            toggleEdit = false;
            getPosts();
        }
        else {
            let msg = document.getElementById('msg');
            setTimeout(() => { msg.innerText = "" }, 3000);
            msg.innerText = 'Something went wrong...';
        }
    }
}

async function getPosts() {
    try {
        const res = await axios.get('https://crudcrud.com/api/622d073037c04707a1cb294f2bcc7d1b/blogs');
        let blog = "";
        blogs = res.data.reverse();
        res.data.forEach((b) => {
            blog += `<div class="blog my-3 border border-1 p-2">
                <h4 class="text-primary"><strong>${b.title}</strong></h4>
                <img class="img-fluid my-2" src="${b.img}" alt="${b.title}" />
                <p>${b.description}</p>
                <button onclick="editBlog(event)" class="btn btn-primary btn-sm" name="${b._id}">Edit</button>
                <button onclick="deleteBlog(event)" class="btn btn-danger btn-sm" name="${b._id}">Delete</button>
            </div>`;
        });
        document.getElementById('blogContainer').innerHTML = blog;
    }
    catch (error) {
        console.log(error);
    }
}

function editBlog(event) {
    _id = event.target.name;
    blogs.forEach((blog) => {
        if (_id === blog._id) {
            document.getElementById("imgUrl").value = blog.img;
            document.getElementById("blogTitle").value = blog.title;
            document.getElementById("description").value = blog.description;
            document.getElementById('submit').innerText = "Update";
            toggleEdit = true;
        }
    });
}


async function deleteBlog(event) {
    try {
        const _id = event.target.name;
        const res = await axios.delete(`https://crudcrud.com/api/622d073037c04707a1cb294f2bcc7d1b/blogs/${_id}`);
        if (res.status === 200)
            getPosts();
    } catch (error) {
        console.log(error);
    }
}


function clearInputs() {
    document.getElementById("imgUrl").value = "";
    document.getElementById("blogTitle").value = "";
    document.getElementById("description").value = "";
}


document.addEventListener('DOMContentLoaded', () => {
    getPosts();
});