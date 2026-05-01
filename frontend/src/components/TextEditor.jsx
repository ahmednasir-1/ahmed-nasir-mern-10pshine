import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu } from '@tiptap/react/menus'
import { BulletList } from '@tiptap/extension-list'
import { Editor } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'


function MenuBar({ editor }) {
    if (!editor) return null

    const btnClass = (isActive) =>
        `px-3 py-1.5 rounded text-sm font-medium transition-all ${isActive
            ? 'bg-blue-500 text-red'
            : 'bg-gray-100 text-blue-700 hover:bg-gray-200'
        }`

    return (
        <div className="flex flex-wrap gap-1 p-4 border-b bg-(--color-heading) rounded-2xl m-3">

            {/* Text Style */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={btnClass(editor.isActive('bold'))}
            >
                B
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btnClass(editor.isActive('italic'))}
            >
                I
            </button>

            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={btnClass(editor.isActive('underline'))}
            >
                U
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={btnClass(editor.isActive('strike'))}
            >
                S
            </button>

            <div className="w-px bg-gray-300 mx-1" />

            {/* Headings */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={btnClass(editor.isActive('heading', { level: 1 }))}
            >
                H1
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btnClass(editor.isActive('heading', { level: 2 }))}
            >
                H2
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={btnClass(editor.isActive('heading', { level: 3 }))}
            >
                H3
            </button>

            <div className="w-px bg-gray-300 mx-1" />

            {/* Lists */}
            <button
                onClick={() => editor.commands.toggleBulletList()}
                className={btnClass(editor.isActive('bulletList'))}
            >
                • List
            </button>

            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btnClass(editor.isActive('orderedList'))}
            >
                1. List
            </button>

            <div className="w-px bg-gray-300 mx-1" />

            {/* Alignment */}
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={btnClass(editor.isActive({ textAlign: 'left' }))}
            >
                Left
            </button>

            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={btnClass(editor.isActive({ textAlign: 'center' }))}
            >
                Center
            </button>

            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={btnClass(editor.isActive({ textAlign: 'right' }))}
            >
                Right
            </button>

            <div className="w-px bg-gray-300 mx-1" />

            {/* Extra */}
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={btnClass(editor.isActive('blockquote'))}
            >
                Quote
            </button>

            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={btnClass(editor.isActive('code'))}
            >
                Code
            </button>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
                Undo
            </button>

            <button
                onClick={() => editor.chain().focus().redo().run()}
                className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
                Redo
            </button>

        </div>
    )
}

function TextEditor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            BulletList.configure({
                keepAttributes: true,
                keepMarks: true,

            }),
            Heading.configure({
                levels: [1,2,3],
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '<p>Start writing your note here...</p>',
        editorProps: {
            attributes: {
                class: 'prose max-w-none mx-3 p-4 min-h-[200px] focus:outline-none',
            },
        },
    })

    return (
        <div className=" m-6 border rounded-lg overflow-hidden shadow-sm bg-(--color-primary)">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default TextEditor