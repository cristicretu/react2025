import { useRouter } from "next/router";
import { getAllFeedback, getAllSites } from "@lib/db-admin";
import { useRef } from "react";
import { FormControl, FormLabel, Input, Button, Box } from "@chakra-ui/core";
import { useAuth } from "@/lib/auth";
import { createFeedback } from "@/lib/db";
import Feedback from "@/components/Feedback";

export async function getStaticProps(context) {
    const siteId = context.params.siteId;
    const { feedback } = await getAllFeedback(siteId);

    return {
        props: {
            initialFeedback: feedback,
        },
        revalidate: 1,
    };
}

export async function getStaticPaths() {
    const { sites } = getAllSites();
    const paths = sites.map((site) => ({
        params: {
            siteId: site.id.toString(),
        },
    }));

    return {
        paths,
        fallback: true,
    };
}
const FeedbackPage = ({ initialFeedback }) => {
    const auth = useAuth();
    const inputEl = useRef(null);
    const router = useRouter();
    const [allFeedback, setAllFeedback] = useState([]);

    useEffect(() => {
        setAllFeedback(initialFeedback);
    }, [initialFeedback]);

    const onSubmit = (e) => {
        e.preventDefault();

        const newFeedback = {
            author: auth.user.name,
            authorId: auth.user.uid,
            siteId: router.query.siteId,
            text: inputEl.current.value,
            createdAt: new Date().toISOString(),
            provider: auth.user.provider,
            status: "pending",
        };

        inputEl.current.value = "";
        setAllFeedback((currentFeedback) => [newFeedback, ...currentFeedback]);
        createFeedback(newFeedback);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            width="full"
            maxWidth="700px"
            margin="0 auto"
        >
            {auth.user && (
                <Box as="form" onSubmit={onSubmit}>
                    <FormControl my={8}>
                        <FormLabel htmlFor="comment">Comment</FormLabel>
                        <Input
                            ref={inputEl}
                            id="comment"
                            placeholder="Leave a comment"
                        />
                        <Button mt={4} type="submit" fontWeight="medium">
                            Add Comment
                        </Button>
                    </FormControl>
                </Box>
            )}
            {initialFeedback &&
                initialFeedback.map((feedback) => (
                    <Feedback
                        key={feedback.id || new Date().getTime().toString()}
                        {...feedback}
                    />
                ))}
        </Box>
    );
};

export default FeedbackPage;
