import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BACKEND_URL } from "@/pages/api/auth/auth";
import CustomLoader from "@/components/CustomLoader";
import Image from "next/image";
import { EventType } from "@/utils/fetchEvents";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { CommentType } from "@/utils/types";

const EventDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isBookmarked, toggleBookmark } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);
  // const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false);
  const [rating, setRating] = useState<string>("");
  const [showComments, setShowComments] = useState(false);


  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        console.log("eventId:", id);
        const response = await axiosInstance.get<{ event: EventType }>(`/api/events-id?id=${id}`);
        if (!response) {
            throw new Error('Failed to fetch event');
          }
          setEvent(response.data.event);
        console.log(event);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);


  const addComment = async () => {
    const user_id = localStorage.getItem('userId');
    if (!user_id) {
      console.log("User ID not found");
      router.push("/auth/Login");
      return;
    }
    if (newComment.trim() === "") return;
    setIsAddingComment(true);
    try {
      await axiosInstance.post("/api/feedbacks", {
        event_id: id,
        user_id: user_id,
        rating: rating,
        comment: newComment,
      });
      await getCommentsAndRatings();
      setNewComment("");
      setRating("");
      toast.success("Comment added successfully");
    } catch (error) { 
      console.error("Error adding comment:", error);
      toast.error("Error adding comment");
    } finally {
      setIsAddingComment(false);
    }
  };  


  // const deleteComment = async (comment: CommentType) => {
  //   setIsDeletingComment(true);
  //   try {
  //     const user_id = localStorage.getItem('userId');
  //     if (!user_id) {
  //       console.error("User ID not found");
  //       setIsDeletingComment(false);
  //       return;
  //     }
  //     await axiosInstance.delete(`/api/feedbacks`, {
  //       params: {
  //         user_id,
  //         event_id: comment.event_id
  //       }
  //     });
  //     setComments(comments.filter((c) => c.id !== comment.id));
  //   } catch (error) { 
  //     console.error("Error deleting comment:", error);
  //   } finally {
  //     setIsDeletingComment(false);
  //   }
  // };  

  // get all comments and ratings
  const getCommentsAndRatings = async () => {
    const response = await axiosInstance.get(`/api/feedbacks/event?event_id=${id}`);
    const feedbacks = response.data.feedbacks;
    setComments(feedbacks);
    console.log("comments",comments);
    setIsLoading(false);
  } 

  const hasEventStarted = event ? new Date(event.start_date) <= new Date() : false;

  if (isLoading) return <CustomLoader />;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!event) return <div className="text-center py-10">Event not found</div>;

  return (
    <>
      <div className="w-full flex h-[64px] bg-gradient-to-r from-[#855FA7] via-[#EC248F] to-[#FCC280]">
        <Navbar/>
      </div>
      <div className="px-4 py-10">
        <div className="max-w-[1280px] mx-auto bg-white rounded-xl overflow-hidden">
          {/* Event Image */}
          <div className="relative h-96 lg:h-[500px] xl:h-[700px]  w-full">
            <Image
              src={`${BACKEND_URL}/${event.image_url}`}
              alt={event.name}
              fill
              className="w-full h-full object-cover rounded-t-[5px]"
              priority
            />
            
          </div>
          {/* Event Details */}
          <div className="p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <span className="text-sm text-[#EC248F] font-semibold uppercase tracking-wider">{event.category}</span>
              <button 
                onClick={() => toggleBookmark(event.id)}
                className='absolute right-2 top-6 p-2 rounded-full'>
                  <Image 
                  src={isBookmarked(event.id) ? '/book-mark-white.svg' : '/book-mark.svg'} 
                  width={20} 
                  height={20} 
                  className='md:w-[24px] md:h-[24px] invert'
                  alt='bookmark'/>
                </button>
            </div>
            <h1 className="text-3xl font-bold mt-2 mb-4 text-[#855fa7]">{event.name}</h1>

            <p className="text-gray-700 text-lg my-6">{event.short_description}</p>
            <div className="grid grid-cols-1 md:flex-col gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Image src="/location.svg" width={24} height={24} alt="location" />
                <div className="text-gray-600">{event.address}, {event.city}</div>
                {event.state && event.postal_code && (
                  <div className="text-gray-600">{event.state} , {event.postal_code}</div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Image src="/calendar.svg" width={24} height={24} alt="date" />
                <div className="text-gray-600">
                    {event.start_date === event.end_date
                      ? formatDate(event.start_date)
                      : `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}
                  </div>
              </div>
            </div>
           
           <div className="flex flex-col gap-6 mt-8">
            <div className="flex items-center gap-3">
              <Image src="/contact.svg" width={24} height={24} alt="contact" />
                <div className="text-gray-600">Contact details : {event.contact_details}</div>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/organization.svg" width={24} height={24} alt="organization" />
              <div className="text-gray-600">Organization name : {event.organization_name}</div>
            </div>
           </div>
            <div className="flex items-center justify-between mt-8">
              <div className="text-2xl font-bold text-[#EC248F]">${event.price}</div>
              <button className="bg-[#855fa7] hover:bg-[#6d479c] text-white px-8 py-3 rounded-lg font-semibold shadow transition">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/* feedback section*/}
      {hasEventStarted && (
        <section className="px-4 mt-8">
          <div className="max-w-[1280px] mx-auto border-[1px] border-gray-300 bg-white rounded-xl overflow-hidden">
            <div className="px-8 py-4">
              <h2 className="text-2xl font-bold text-[#EC248F]">Feedback</h2>
            </div>
            <div className="px-8 py-4 flex flex-col gap-3">
              <input 
                type="text" 
                value={newComment} 
                placeholder="Add a comment"
                onChange={(e) => setNewComment(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <div className="flex items-center gap-3">
                <label htmlFor="rating">Rating</label>
                <input 
                type="text" 
                id="rating"
                name="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
                className="w-1/3 p-2 border border-gray-300 rounded-md" />
              </div>
              <button 
                onClick={addComment} 
                className="bg-[#855fa7] hover:bg-[#6d479c] mt-12 w-full md:w-[300px] md:mx-auto text-white text-sm p-2 rounded-lg font-semibold shadow transition">
                Add Comment
              </button>
            </div>
            {/* show all comments */}
            <div className="p-8">
              {showComments && (
                <div className="flex flex-col gap-4">
                  {comments?.length === 0 ? (
                    <p className="text-gray-500 text-center">No comments yet.</p>
                  ) : (
                    [...comments]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
                        >
                          <div className="flex items-center mb-2 gap-2">
                            <span className="font-medium bg-[#855fa7] p-2 rounded-full text-white">
                              {comment.user ? `${comment.user.first_name[0].toUpperCase()}${comment.user.last_name[0].toUpperCase()}` : comment.user_id}
                            </span>
                            <p className="text-gray-700">{comment.comment}</p>
                          </div>
                          <span className="text-gray-500 font-semibold">Rating: {comment.rating}</span>
                        </div>
                      ))
                  )}
                </div>
              )}
              <div
                onClick={() => {
                  if (!showComments) getCommentsAndRatings();
                  setShowComments((prev) => !prev);
                }}
                className="mt-6 text-gray-400 font-semibold mx-auto"
              >
                {showComments ? "Show Less" : "Show All Comments"}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default EventDetails; 