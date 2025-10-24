import { Card } from '../components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import axios from 'axios'
import { Reply } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'

const Comments = () => {
  const [allComments, setAllComments] = useState([])
  const navigate = useNavigate()

  const getTotalComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/comment/my-blogs/comments`,
        { withCredentials: true }
      )
      if (res.data.success) {
        setAllComments(res.data.comments)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTotalComments()
  }, [])

  return (
    <div className='pb-10 pt-20 md:ml-[320px] min-h-screen'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className='w-full p-5 space-y-2 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700'>
          <Table>
            
            <TableHeader>
              <TableRow>
                <TableHead>Blog Title</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>By</TableHead>
                <TableHead className='text-center'>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {allComments.length > 0 ? (
                allComments.map((comment, index) => (
                  <TableRow
                    key={index}
                    className='hover:bg-gray-50 dark:hover:bg-gray-700 transition'
                  >
                    <TableCell className='font-medium'>
                      {comment.postId?.title || 'Deleted Blog'}
                    </TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{comment.userId?.firstName || 'Unknown'}</TableCell>

                    {/* ✅ Reply Button - Centered under "Action" */}
                    <TableCell className='text-right pr-6'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          navigate(`/blogs/${comment.postId._id}#comment-${comment._id}`)
                        }
                        className='flex items-center gap-2 text-blue-600 border-blue-500 hover:bg-blue-600 hover:text-white mx-auto'
                      >
                        <Reply className='h-4 w-4' />
                        Reply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className='text-center text-gray-500 py-6'>
                    No comments found on your blogs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

export default Comments
