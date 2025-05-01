import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  Text,
  HStack,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import countryList from "react-select-country-list";

const steps = [
  { title: "About You", description: "Enter your personal details" },
  { title: "Professional Background", description: "Your work experience" },
  { title: "Expertise", description: "Areas you can mentor in" },
  { title: "Motivation", description: "Why you want to be a mentor" },
];

const MentorApplicationForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    profilePhoto: null,
    profilePhotoURL: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    jobTitle: "",
    company: "",
    location: "",
    category: "",
    skills: "",
    bio: "",
    linkedin: "",
    twitter: "",
    website: "",
    introVideo: "",
  });

  const isMobile = useBreakpointValue({ base: true, md: false });
  const countryOptions = countryList().getData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: files[0],
        profilePhotoURL: files[0] ? URL.createObjectURL(files[0]) : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    const required = {
      0: ["profilePhoto", "firstName", "lastName", "email", "password", "confirmPassword"],
      1: ["jobTitle", "company", "location"],
      2: ["category", "skills"],
      3: ["bio", "linkedin", "twitter", "website", "introVideo"],
    }[activeStep];

    if (required.some((f) => !formData[f])) {
      return alert("Please fill in all required fields before proceeding.");
    }

    if (activeStep === 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return alert("Please enter a valid email address.");
      }
      if (formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match.");
      }
    }

    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const handleSubmit = async () => {
    const toSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "profilePhoto") {
          toSend.append(key, value);
        } else {
          toSend.append(key, value.toString());
        }
      }
    });

    console.log("Mentor form data before submission:");
    for (let pair of toSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.post("http://localhost:3001/api/mentors/apply", toSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Store email in localStorage
      localStorage.setItem('mentorEmail', formData.email);
      
      // Store the token if your backend sends one
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      alert("Application submitted successfully!");
      // Redirect to congrats page
      navigate("/mentor/done");
    } catch (err) {
      console.error("Error submitting application:", err.response || err);
      alert(err.response?.data?.error || "Failed to submit. Please try again.");
    }
  };

  return (
    <Box bg="#f7f9fc" minH="100vh" py={10} px={isMobile ? 4 : 16}>
      <Heading size="xl" color="2c3e50" mb={4}>
        Apply to Become a Mentor
      </Heading>
      <Text fontSize="md" color="gray.600" mb={10}>
        Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
      </Text>

      <Box bg="white" p={8} borderRadius="xl" boxShadow="md" width="100%" maxW="100%">
        <VStack spacing={5} align="stretch">
          {activeStep === 0 && (
            <>
              <Box>
                <Text mb={1}>Profile Photo</Text>
                <Input
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
                {formData.profilePhotoURL && (
                  <Text>
                    Uploaded:{" "}
                    <a
                      href={formData.profilePhotoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formData.profilePhoto.name}
                    </a>
                  </Text>
                )}
              </Box>
              <Box>
                <Text mb={1}>First Name</Text>
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Last Name</Text>
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Email</Text>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Password</Text>
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Confirm Password</Text>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Box>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Box>
                <Text mb={1}>Job Title</Text>
                <Input
                  name="jobTitle"
                  placeholder="e.g., Software Engineer"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Company</Text>
                <Input
                  name="company"
                  placeholder="Where do you work?"
                  value={formData.company}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Location</Text>
                <ReactSelect
                  name="location"
                  options={countryOptions}
                  placeholder="Select your country"
                  value={countryOptions.find(
                    (opt) => opt.value === formData.location
                  )}
                  onChange={(opt) =>
                    setFormData((p) => ({ ...p, location: opt.value }))
                  }
                />
              </Box>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Box>
                <Text mb={1}>Mentoring Category</Text>
                <Select
                  name="category"
                  placeholder="Select category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>Engineering & Data</option>
                  <option>UX & Design</option>
                  <option>Business & Management</option>
                  <option>Product & Marketing</option>
                </Select>
              </Box>
              <Box>
                <Text mb={1}>Skills</Text>
                <Input
                  name="skills"
                  placeholder="List your skills (comma separated)"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </Box>
            </>
          )}

          {activeStep === 3 && (
            <>
              <Box>
                <Text mb={1}>Short Bio</Text>
                <Textarea
                  name="bio"
                  placeholder="Write your short bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>LinkedIn URL</Text>
                <Input
                  name="linkedin"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Twitter Handle</Text>
                <Input
                  name="twitter"
                  placeholder="@yourhandle"
                  value={formData.twitter}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Personal Website URL</Text>
                <Input
                  name="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Intro Video URL</Text>
                <Input
                  name="introVideo"
                  placeholder="Link to your intro video"
                  value={formData.introVideo}
                  onChange={handleChange}
                />
              </Box>
            </>
          )}
        </VStack>

        <Divider my={8} />

        <HStack justify="space-between">
          {activeStep > 0 && (
            <Button onClick={handleBack} colorScheme="gray">
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} colorScheme="purple">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} colorScheme="green">
              Submit Application
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default MentorApplicationForm;
