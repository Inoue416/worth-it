// pages/api/posts.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prismaClient } from '@/lib/prismaClientProvider';
import { FetchLimit } from '@/defines/posts';
import { GetPostDto, SubmitPostDto } from '@/dtos/PostDto';

const prisma = new prismaClient;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return handleGET(req, res, session);
    case 'POST':
      return handlePOST(req, res, session);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export type GetPostType = {
  posts: Array<GetPostDto>;
  nowOffset: number;
};

async function handleGET(req: NextApiRequest, res: NextApiResponse, session: any) {
  const { nowOffset = "0" } = req.query;
  const nowOffsetNumber = parseInt(nowOffset as string, 10);
  const skip = nowOffsetNumber * FetchLimit;

  try {
    const posts: Array<GetPostDto> = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            appealPoint: true,
            price: true,
            link: true,
            category: true,
            image_url: true,
            updated_at: true,
        },
        // TODO: 今後Whereでカテゴリを区切るようにする
    //   where: {
    //   },
        skip: skip,
      take: FetchLimit,
      orderBy: { updatedAt: 'desc' },
    });
    const nextOffset = nowOffsetNumber + 1;
    res.status(200).json({
      posts,
      nowOffset: nextOffset,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
}


async function handlePOST(req: NextApiRequest, res: NextApiResponse, session: any) {
  const postData: SubmitPostDto = req.body;

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await prisma.post.create({
      data: {
        ...postData
      },
    });

    res.status(201).json({ message: "Success create post." });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
}