import SpecificFieldTopics from "@/components/SpecificFieldTopics";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";


async function getTopicFromFields(fieldSlug: string) {
  const field = await prisma.field.findFirst({
    where: {
      name: {
        equals: fieldSlug.replace("-", " "),
        mode: "insensitive",
      },
    },
    include: {
      topics: {
        orderBy: { name: "asc" },
      },
    },
  });

  return field;
}


export default async function TopicFieldsPage({params}: {params: Promise<{ fieldSlug: string }>}) {
  const { fieldSlug } = await params;

  const field = await getTopicFromFields(fieldSlug);

  if (!field) {
    notFound();
  }

  return <SpecificFieldTopics field={field} />;
}
