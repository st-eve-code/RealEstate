#!/bin/bash

# Helper script to convert a single React Router component to Next.js
# Usage: ./convert-component.sh src/components/Navbar.jsx

if [ -z "$1" ]; then
  echo "Usage: ./convert-component.sh <file-path>"
  echo "Example: ./convert-component.sh src/components/Navbar.jsx"
  exit 1
fi

FILE="$1"

if [ ! -f "$FILE" ]; then
  echo "Error: File '$FILE' not found"
  exit 1
fi

echo "Converting $FILE to Next.js..."

# Backup original file
cp "$FILE" "$FILE.backup"

# Check if file needs 'use client' directive
if grep -q "useState\|useEffect\|useContext\|onClick\|onChange\|onSubmit" "$FILE"; then
  if ! grep -q "'use client'" "$FILE"; then
    # Add 'use client' at the top
    echo "'use client'" > "$FILE.tmp"
    echo "" >> "$FILE.tmp"
    cat "$FILE" >> "$FILE.tmp"
    mv "$FILE.tmp" "$FILE"
    echo "  ✓ Added 'use client' directive"
  fi
fi

# Convert imports - handle different import patterns
sed -i.bak1 "s/import { useNavigate, Link } from 'react-router-dom'/import { useRouter } from 'next\/navigation'\nimport Link from 'next\/link'/g" "$FILE"
sed -i.bak2 "s/import { Link, useNavigate } from 'react-router-dom'/import { useRouter } from 'next\/navigation'\nimport Link from 'next\/link'/g" "$FILE"
sed -i.bak3 "s/import { useNavigate } from 'react-router-dom'/import { useRouter } from 'next\/navigation'/g" "$FILE"
sed -i.bak4 "s/import { Link } from 'react-router-dom'/import Link from 'next\/link'/g" "$FILE"
sed -i.bak5 "s/import { Navigate } from 'react-router-dom'/import { redirect } from 'next\/navigation'/g" "$FILE"
sed -i.bak6 "s/import { useParams } from 'react-router-dom'/import { useParams } from 'next\/navigation'/g" "$FILE"
sed -i.bak7 "s/import { useLocation } from 'react-router-dom'/import { usePathname } from 'next\/navigation'/g" "$FILE"

# Remove backup files created by sed
rm -f "$FILE".bak*

# Convert hook declarations
sed -i.bak "s/const navigate = useNavigate()/const router = useRouter()/g" "$FILE"
sed -i.bak "s/const location = useLocation()/const pathname = usePathname()/g" "$FILE"
rm -f "$FILE.bak"

# Convert function calls
sed -i.bak "s/navigate(\([^)]*\))/router.push(\1)/g" "$FILE"
rm -f "$FILE.bak"

# Convert Link props (to -> href)
sed -i.bak 's/<Link to=/<Link href=/g' "$FILE"
rm -f "$FILE.bak"

# Convert Navigate component
sed -i.bak "s/<Navigate to=\([^>]*\)\/>/redirect(\1)/g" "$FILE"
rm -f "$FILE.bak"

# Convert location.pathname
sed -i.bak "s/location\.pathname/pathname/g" "$FILE"
rm -f "$FILE.bak"

echo "  ✓ Converted imports and hooks"
echo "  ✓ Updated navigation calls"
echo "  ✓ Updated Link components"
echo ""
echo "✅ Conversion complete!"
echo ""
echo "Backup saved as: $FILE.backup"
echo ""
echo "Next steps:"
echo "  1. Review the changes in $FILE"
echo "  2. Fix any syntax errors"
echo "  3. Test the component"
echo "  4. If everything works, delete $FILE.backup"
