"use client";
import {
  CreateOrganizationDialog,
  ErrorComponent,
  HasDevPermission,
  LoadingSkeletons,
  type OrganizationType,
  PageHeader,
  Searchbar,
  getCloudinaryURL,
  useOrganization,
} from "@honohub/shared";
import { Avatar, Spinner, Text } from "@rafty/ui";
import { useIsFetching } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type PropsWithChildren, Suspense } from "react";
import { RootPageWrapper } from "./Wrapper";

export default function HomePage() {
  return (
    <RootPageWrapper>
      <Suspense>
        <Header />
        <Searchbar placeholder="Search organization" />
      </Suspense>
      <OrganisationsRender />
    </RootPageWrapper>
  );
}

function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const orgSearch = pathname === "/" ? search : "";
  const queryKey = ["organisations", orgSearch];

  const fetching = useIsFetching({ queryKey });
  const isFetching = fetching !== 0;
  return (
    <PageHeader title="Organisations">
      <div className="flex-1" />
      {isFetching && <Spinner />}
      <HasDevPermission>
        <CreateOrganizationDialog />
      </HasDevPermission>
    </PageHeader>
  );
}

function OrganisationsRender() {
  const { organisations, isLoading, isError, isFetching } = useOrganization();

  const GridWrapper = (props: PropsWithChildren) => (
    <div className="grid grid-cols-1 gap-2 md:gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {props.children}
    </div>
  );

  if (isLoading)
    return (
      <GridWrapper>
        <LoadingSkeletons
          count={12}
          className="h-[57px] md:h-[64px] lg:h-[76px] rounded md:rounded-md"
        />
      </GridWrapper>
    );

  if (isError)
    return (
      <ErrorComponent className="h-[500px]">
        Error getting organisations data
      </ErrorComponent>
    );

  if (organisations) {
    if (organisations.length > 0)
      return (
        <GridWrapper>
          {organisations.map((organisation) => (
            <OrganizationCard key={organisation._id} {...organisation} />
          ))}
        </GridWrapper>
      );
    if (!isFetching)
      return (
        <div className="flex h-[500px] w-full items-center justify-center select-none">
          <p className="text-secondary-400 dark:text-secondary-600">
            No organization found
          </p>
        </div>
      );
  }
}

function OrganizationCard(props: OrganizationType) {
  return (
    <Link href={`/organisations/${props.slug}`}>
      <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 rounded md:rounded-md bg-secondary-100 hover:shadow-lg p-3 md:p-3.5 lg:p-4 transition-all ease-in-out dark:hover:shadow-none dark:bg-secondary-900 dark:hover:bg-secondary-800">
        <Avatar
          src={props.logo && getCloudinaryURL(props.logo)}
          name={props.name}
          className="min-w-8 size-8 md:min-w-9 md:size-9 lg:min-w-10 lg:size-10 xl:min-w-11 xl:size-11"
        />
        <div className="w-full">
          <h3 className="text-sm md:text-base lg:text-lg font-medium leading-tight md:leading-none lg:leading-none">
            {props.name}
          </h3>
          <Text className="line-clamp-1 italic text-secondary-500 text-xs md:text-sm dark:text-secondary-400">
            {props.slug}
          </Text>
        </div>
      </div>
    </Link>
  );
}
