import { useState } from "react";
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData((prev) => ({ ...prev, profilePhoto: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    const requiredFieldsByStep = {
      0: ["profilePhoto", "firstName", "lastName", "email"],
      1: ["jobTitle", "company", "location"],
      2: ["category", "skills"],
      3: ["bio", "linkedin", "twitter", "website", "introVideo"],
    };

    const requiredFields = requiredFieldsByStep[activeStep];
    const isValid = requiredFields.every((field) => {
      const value = formData[field];
      return value !== "" && value !== null;
    });

    if (!isValid) {
      alert("Please fill in all the required fields before proceeding.");
      return;
    }

    if (activeStep === 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const navigate = useNavigate();
  const handleSubmit = () => {
    console.log(formData);
    // Here you can send data to backend if needed
    navigate("/mentor/done");
  };

  return (
    <Box bg="#f7f9fc" minHeight="100vh" py={10} px={isMobile ? 4 : 16}>
      <Heading size="xl" color="#2c3e50" mb={4}>
        Apply to Become a Mentor
      </Heading>
      <Text fontSize="md" color="gray.600" mb={10}>
        Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
      </Text>

      <Box
        bg="white"
        boxShadow="md"
        p={8}
        borderRadius="xl"
        width="100%"
        maxW="100%"
      >
        <VStack spacing={5} align="stretch">
          {activeStep === 0 && (
            <>
              <Box>
                <Text mb={1}>Profile Photo</Text>
                <Input
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageURL = URL.createObjectURL(file);
                      setFormData((prev) => ({
                        ...prev,
                        profilePhoto: file,
                        profilePhotoURL: imageURL,
                      }));
                    }
                  }}
                />
                {formData.profilePhoto && formData.profilePhotoURL && (
                  <Text mt={2}>
                    Uploaded:{" "}
                    <a
                      href={formData.profilePhotoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3182CE", textDecoration: "underline" }}
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
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Last Name</Text>
                <Input
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Email</Text>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
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
                <Text mb={1}>country</Text>
                <ReactSelect
                  name="location"
                  options={countryOptions}
                  placeholder="Select your country"
                  value={countryOptions.find(
                    (option) => option.value === formData.location
                  )}
                  onChange={(selectedOption) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: selectedOption.value,
                    }))
                  }
                />
              </Box>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Box>
                <Text mb={1}>Category</Text>
                <Select
                  name="category"
                  placeholder="Select your mentoring category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Engineering & Data">Engineering & Data</option>
                  <option value="UX & Design">UX & Design</option>
                  <option value="Business & Management">
                    Business & Management
                  </option>
                  <option value="Product & Marketing">
                    Product & Marketing
                  </option>
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
                  placeholder="Write a short bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>LinkedIn URL</Text>
                <Input
                  name="linkedin"
                  placeholder="https://linkedin.com/in/your-profile"
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
                <Text mb={1}>Personal Website</Text>
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
            <Button colorScheme="purple" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button colorScheme="green" onClick={handleSubmit}>
              Submit Application
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default MentorApplicationForm;
