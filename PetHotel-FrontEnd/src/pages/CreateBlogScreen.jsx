import React, { Component } from 'react';
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill, { Quill, Mixin, Toolbar,Editor } from 'react-quill';
import './CreateBlogScreen.css';
import Navbar from '../components/Navbar';
class CreateBlogScreen extends React.Component {
    state={
        content: '',
        title: '',
        imageFile: '',
        loading: '',
        message: '',
    }
    handleChangeTitle = (event) => {
        this.setState({
            title: event.target.value,
        })
    }
    handleChangeContent = (event) => {
        this.setState({
            content: event,
        })
    }
    handleFileChange = (event) => {
        console.log(event.target.files);
        //show preview
        const imageFile = event.target.files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader.result);
                this.setState({
                    imageFile: imageFile,
                });
            };
            reader.readAsDataURL(imageFile);
        }
        // save to state
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
        });

        const formData = new FormData();
    formData.append('image',this.state.imageFile);    
    fetch('http://localhost:3001/api/uploadImages/image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
        .then((res)=>{
            return res.json();
        })
        .then((data)=> {
            console.log(data);
            if (!data.success) {
                this.setState({
                    loading: false,
                    message: data.message,
                });
            } else {
                fetch('http://localhost:3001/api/blog/post', {
                    method: "POST",
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        title: this.state.title,
                        image: data.data.imageUrl,
                        content: this.state.content,
                    }),
                })
                .then((response)=>{
                    return response.json();
                })
                .then((responseData)=>{
                    if (!responseData.success) {
                        this.setState({
                            message: responseData.message,
                            loading: false,
                        });
                    } else {
                        this.setState({
                            message: 'Bài viết đã được đăng tải!',
                            loading: false,
                            content: '',
                            title: '',
                            imageFile: '',
                        })
                    }
                })
                .catch((err)=> {
                    console.log(err);
            this.setState({
                message: err.message,
                loading: false,
            });
                })
            }
        })
        .catch((error)=>{
            console.log(error);
            this.setState({
                message: error.message,
                loading: false,
            });
        })

    };
    
    render() {
        return (
            <div>
                <Navbar/>
                <div className='container mt-4' style={{
                  minHeight: '1000px',
                }}>
                <h3>Chia sẻ kinh nghiệm của riêng bạn</h3>
                
                <br></br>
                <p style={{
                    color: 'red'
                }}>{this.state.message}</p>
                <div className="form-group">
    <label for="exampleInputPassword1">Tiêu đề cho bài viết</label>
    <input type="text" className="form-control" id="exampleInputPassword1" value={this.state.title} onChange={this.handleChangeTitle}/>
  </div>
  <label for="exampleInputPassword1">Hình ảnh mô tả cho bài viết</label>

  <div className="input-group mb-3">
  
  

  <div className="custom-file">
  <input
                                                                type='file'
                                                                className='btn btn-outline-primary file-input'
                                                                onChange={this.handleFileChange}
                                                            />
   
  </div>
</div>

                <div className='app mt-5'>
                <label for="exampleInputPassword1">Nội dung bài viết</label>
                <ReactQuill value={this.state.content}
                onChange={this.handleChangeContent}
                modules={{ toolbar: [
                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                    [{size: []}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, 
                     {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image'],
                    ['clean']
                  ],
                  clipboard: {
                    // toggle to add extra line breaks when pasting HTML:
                    matchVisual: false,
                  }}}
                  formats={[
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent',
                    'link', 'image'
                  ]}
                bounds={'.app'}
                placeholder={'Chia sẻ câu chuyện của bạn'}
                />
                </div>
                
                <br></br>
                {this.state.loading ? (
                    <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Tạo bài viết</button>
                    ) }
            </div>
            </div>
            
        )
    }
}

export default CreateBlogScreen;
