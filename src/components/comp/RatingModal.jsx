import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Textarea,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import PropTypes from 'prop-types';

const RatingModal = ({ isOpen, onClose, mentorId, mentorName, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating before submitting',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Submitting rating:', { mentorId, rating, hasReview: !!review.trim() });
      
      await axios.post(
        `http://localhost:3001/api/mentors/${mentorId}/rate`,
        {
          rating,
          review: review.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: 'Rating Submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
      });

      if (onRatingSubmit) {
        onRatingSubmit(rating);
      }
      
      onClose();
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit rating';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rate {mentorName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text mb={2}>How would you rate your experience?</Text>
            <HStack spacing={2} justify="center">
              {[1, 2, 3, 4, 5].map((index) => (
                <Icon
                  key={index}
                  as={FaStar}
                  boxSize={8}
                  color={(hover || rating) >= index ? "yellow.400" : "gray.300"}
                  cursor="pointer"
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </HStack>
            <Text textAlign="center" color="gray.500">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </Text>
            <Textarea
              placeholder="Share your experience with this mentor (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
            />
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting"
            >
              Submit Rating
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

RatingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mentorId: PropTypes.string.isRequired,
  mentorName: PropTypes.string.isRequired,
  onRatingSubmit: PropTypes.func,
};

export default RatingModal; 