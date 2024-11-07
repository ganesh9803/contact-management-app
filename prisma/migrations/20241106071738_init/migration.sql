-- Create the "User" table
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create the "Contact" table
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- Create unique index for email in the "User" table
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create unique index for email in the "Contact" table
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- Add foreign key constraint to "Contact" table
ALTER TABLE "Contact"
ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Create function to check for unique email
CREATE OR REPLACE FUNCTION check_unique_email() 
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the email exists in the "User" table
  IF EXISTS (SELECT 1 FROM "User" WHERE "email" = NEW."email") THEN
    RAISE EXCEPTION 'Email already exists in the User table';
  END IF;

  -- Check if the email exists in the "Contact" table
  IF EXISTS (SELECT 1 FROM "Contact" WHERE "email" = NEW."email") THEN
    RAISE EXCEPTION 'Email already exists in the Contact table';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for the "User" table
CREATE TRIGGER check_user_email
BEFORE INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION check_unique_email();

-- Trigger for the "Contact" table
CREATE TRIGGER check_contact_email
BEFORE INSERT ON "Contact"
FOR EACH ROW
EXECUTE FUNCTION check_unique_email();
