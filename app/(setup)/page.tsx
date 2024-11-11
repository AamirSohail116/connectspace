import { InitialModal } from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/initial-profile";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import React from "react";

const SetupPage = async () => {
  const profile = await initialProfile();

  // Ensure profile is not a NextResponse, check that it has the expected properties.
  if ("id" in profile) {
    const server = await prismadb.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    if (server) {
      return redirect(`/servers/${server.id}`);
    }
  }

  return <InitialModal />;
};

export default SetupPage;
