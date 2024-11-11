import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: {
    inviteCode: string;
  };
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const profile = await currentProfile();

  // Check if the profile exists
  if (!profile) {
    return auth().redirectToSignIn();
  }

  console.log("params", params);

  // Check if inviteCode is provided
  if (!params.inviteCode) {
    return redirect("/");
  }

  // Find the server by inviteCode and current profile membership
  const existingServer = await prismadb.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // If the user is already a member of the server, redirect them
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // Check if a server with the inviteCode exists
  const serverToUpdate = await prismadb.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
    },
  });

  // If no server with the inviteCode is found, handle the error
  if (!serverToUpdate) {
    // Handle the case where the invite code is invalid
    return redirect("/"); // Or show an error message if appropriate
  }

  // Proceed with adding the member to the server
  const updatedServer = await prismadb.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  // Redirect to the updated server page
  if (updatedServer) {
    return redirect(`/servers/${updatedServer.id}`);
  }

  return null;
};

export default InvitePage;
