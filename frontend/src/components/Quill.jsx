import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export default function Quill({ value, onChange }) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'formula'],

            [{ 'script': 'sub' }, { 'script': 'super' }],     
            [{ 'indent': '-1' }, { 'indent': '+1' }],          
            [{ 'direction': 'rtl' }],                         

            [{ 'size': ['small', false, 'large', 'huge'] }],  
            [{ 'color': [] }, { 'background': [] }],          
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
        ]
    }
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            placeholder="Start writing your note..."
        />
    )
}

