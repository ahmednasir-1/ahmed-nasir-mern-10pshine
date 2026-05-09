import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export default function Quill({ value, onChange }) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
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

